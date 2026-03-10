package com.unicorn.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_products_category_id", columnList = "category_id"),
        @Index(name = "idx_products_name", columnList = "name")
})
@SQLRestriction("deleted_at IS NULL")
@SQLDelete(sql = "UPDATE products SET deleted_at = CURRENT_TIMESTAMP(6) WHERE id = ?")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    /** 가격 단위. USD 또는 KRW. API 응답 시 USD면 환율 적용해 KRW로 변환해 전달 */
    @Builder.Default
    @Column(nullable = false, length = 3)
    private String currency = "USD";

    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private List<String> images;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "weight", length = 100)
    private String weight;

    @Column(name = "total_height", length = 100)
    private String totalHeight;

    @Column(name = "operating_time", length = 100)
    private String operatingTime;

    @Column(length = 100)
    private String battery;

    @Column(length = 100)
    private String speed;

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    /** AI 채팅/제품 카탈로그용 요약. 백오피스에서 직접 작성·수정. 비어 있으면 shortDescription 사용 */
    @Column(name = "ai_summary", length = 500)
    private String aiSummary;

    @Column(columnDefinition = "TEXT")
    private String content;
}
