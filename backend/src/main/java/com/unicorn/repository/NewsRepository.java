package com.unicorn.repository;

import com.unicorn.entity.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NewsRepository extends JpaRepository<News, Long> {

    @Query("SELECT n FROM News n WHERE n.published = true "
            + "AND (:keyword IS NULL OR :keyword = '' OR LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
            + "ORDER BY n.createdAt DESC")
    Page<News> findPublishedByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT n FROM News n WHERE n.published = true "
            + "AND (:keyword IS NULL OR :keyword = '' OR LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
            + "AND EXISTS (SELECT 1 FROM NewsTag nt WHERE nt.news = n AND nt.tag.id IN :tagIds) "
            + "ORDER BY n.createdAt DESC")
    Page<News> findPublishedByKeywordAndTagIds(@Param("keyword") String keyword,
                                               @Param("tagIds") List<Long> tagIds,
                                               Pageable pageable);

    @Modifying
    @Query("UPDATE News n SET n.viewCount = n.viewCount + 1 WHERE n.id = :id")
    void incrementViewCount(@Param("id") Long id);

    @Query("SELECT n FROM News n WHERE n.published = true ORDER BY n.viewCount DESC")
    List<News> findPublishedOrderByViewCountDesc(Pageable pageable);

    @Query("SELECT n FROM News n WHERE n.published = true AND n.isFeatured = true ORDER BY CASE WHEN n.featuredOrder IS NULL THEN 1 ELSE 0 END, n.featuredOrder ASC")
    List<News> findPublishedFeaturedOrderByFeaturedOrder(Pageable pageable);

    @Query("SELECT n FROM News n WHERE n.id IN :ids ORDER BY n.createdAt DESC")
    List<News> findByIdInOrderByCreatedAtDesc(List<Long> ids);

    @Query("SELECT n FROM News n WHERE (:keyword IS NULL OR :keyword = '' OR LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) ORDER BY n.createdAt DESC")
    Page<News> findAllForAdmin(@Param("keyword") String keyword, Pageable pageable);
}
