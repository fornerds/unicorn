package com.unicorn.service;

import com.unicorn.dto.cart.AddCartItemRequest;
import com.unicorn.dto.cart.CartResponse;
import com.unicorn.dto.cart.UpdateCartItemRequest;
import com.unicorn.entity.CartItem;
import com.unicorn.entity.Product;
import com.unicorn.repository.CartItemRepository;
import com.unicorn.repository.ProductRepository;
import com.unicorn.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
        BigDecimal total = items.stream()
                .map(ci -> ci.getProduct().getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return CartResponse.builder()
                .items(items.stream().map(this::toItemDto).collect(Collectors.toList()))
                .totalAmount(total)
                .build();
    }

    @Transactional
    public CartResponse.CartItemDto addItem(Long userId, AddCartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("제품을 찾을 수 없습니다."));
        if (product.getStock() < request.getQuantity()) {
            throw new IllegalArgumentException("재고가 부족합니다.");
        }
        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, request.getProductId())
                .orElse(null);
        if (item != null) {
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item = cartItemRepository.save(item);
        } else {
            item = CartItem.builder()
                    .user(userRepository.getReferenceById(userId))
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            item = cartItemRepository.save(item);
        }
        BigDecimal price = product.getPrice();
        return CartResponse.CartItemDto.builder()
                .id(item.getId())
                .productId(product.getId())
                .product(CartResponse.ProductSummary.builder()
                        .id(product.getId())
                        .name(product.getName())
                        .price(price)
                        .imageUrl(product.getImageUrl())
                        .build())
                .quantity(item.getQuantity())
                .price(price)
                .build();
    }

    @Transactional
    public CartResponse.CartItemDto updateItem(Long userId, Long itemId, UpdateCartItemRequest request) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 항목을 찾을 수 없습니다."));
        if (!item.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }
        if (item.getProduct().getStock() < request.getQuantity()) {
            throw new IllegalArgumentException("재고가 부족합니다.");
        }
        item.setQuantity(request.getQuantity());
        item = cartItemRepository.save(item);
        return toItemDto(item);
    }

    @Transactional
    public void deleteItem(Long userId, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 항목을 찾을 수 없습니다."));
        if (!item.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }
        cartItemRepository.delete(item);
    }

    private CartResponse.CartItemDto toItemDto(CartItem ci) {
        Product p = ci.getProduct();
        return CartResponse.CartItemDto.builder()
                .id(ci.getId())
                .productId(p.getId())
                .product(CartResponse.ProductSummary.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .price(p.getPrice())
                        .imageUrl(p.getImageUrl())
                        .build())
                .quantity(ci.getQuantity())
                .price(p.getPrice())
                .build();
    }
}
