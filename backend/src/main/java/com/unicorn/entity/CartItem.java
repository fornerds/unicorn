package com.unicorn.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items", indexes = {
        @Index(name = "idx_cart_items_user_id", columnList = "user_id"),
        @Index(name = "uk_cart_items_user_product_color", columnList = "user_id, product_id, color", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, length = 100)
    @Builder.Default
    private String color = "";

    @Column(nullable = false)
    private Integer quantity;
}
