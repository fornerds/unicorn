package com.unicorn.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_color_stock", uniqueConstraints = {
        @UniqueConstraint(name = "uk_product_color_stock_product_color", columnNames = {"product_id", "color"})
}, indexes = {
        @Index(name = "idx_product_color_stock_product_id", columnList = "product_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductColorStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, length = 100)
    private String color;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "created_at", nullable = false, updatable = false)
    private java.time.Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private java.time.Instant updatedAt;

    @PrePersist
    public void prePersist() {
        var now = java.time.Instant.now();
        if (this.createdAt == null) this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = java.time.Instant.now();
    }
}
