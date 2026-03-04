package com.unicorn.repository;

import com.unicorn.entity.ProductColorStock;

import java.util.List;

public interface ProductColorStockRepository extends org.springframework.data.jpa.repository.JpaRepository<ProductColorStock, Long> {

    List<ProductColorStock> findByProductIdOrderByColor(Long productId);
}
