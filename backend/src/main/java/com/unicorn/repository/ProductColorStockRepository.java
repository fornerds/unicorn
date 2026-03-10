package com.unicorn.repository;

import com.unicorn.entity.ProductColorStock;

import java.util.List;
import java.util.Optional;

public interface ProductColorStockRepository extends org.springframework.data.jpa.repository.JpaRepository<ProductColorStock, Long> {

    List<ProductColorStock> findByProductIdOrderByColor(Long productId);

    Optional<ProductColorStock> findByProduct_IdAndColor(Long productId, String color);

    void deleteByProduct_Id(Long productId);
}
