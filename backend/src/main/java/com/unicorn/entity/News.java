package com.unicorn.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "news", indexes = {
        @Index(name = "idx_news_published", columnList = "published"),
        @Index(name = "idx_news_is_featured_order", columnList = "is_featured, featured_order"),
        @Index(name = "idx_news_view_count", columnList = "view_count")
})
@SQLRestriction("deleted_at IS NULL")
@SQLDelete(sql = "UPDATE news SET deleted_at = CURRENT_TIMESTAMP(6) WHERE id = ?")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class News extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @Column(name = "published_at")
    private Instant publishedAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean published = false;

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Integer viewCount = 0;

    @Column(name = "is_featured", nullable = false)
    @Builder.Default
    private Boolean isFeatured = false;

    @Column(name = "featured_order")
    private Integer featuredOrder;

    @OneToMany(mappedBy = "news", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<NewsTag> newsTags = new ArrayList<>();
}
