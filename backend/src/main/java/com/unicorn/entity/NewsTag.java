package com.unicorn.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;

@Entity
@Table(name = "news_tags", indexes = {
        @Index(name = "idx_news_tags_tag_id", columnList = "tag_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(NewsTag.NewsTagId.class)
public class NewsTag {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "news_id", nullable = false)
    private News news;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", nullable = false)
    private Tag tag;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NewsTagId implements Serializable {
        private News news;
        private Tag tag;
    }
}
