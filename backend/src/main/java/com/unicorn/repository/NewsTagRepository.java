package com.unicorn.repository;

import com.unicorn.entity.NewsTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface NewsTagRepository extends JpaRepository<NewsTag, NewsTag.NewsTagId> {

    List<NewsTag> findByNews_Id(Long newsId);

    @Query("SELECT nt FROM NewsTag nt JOIN FETCH nt.tag WHERE nt.news.id = :newsId")
    List<NewsTag> findByNewsIdWithTag(@Param("newsId") Long newsId);

    void deleteByNews_Id(Long newsId);

    @Query("SELECT nt.tag.id FROM NewsTag nt WHERE nt.news.id = :newsId")
    Set<Long> findTagIdsByNewsId(Long newsId);

    @Query("SELECT DISTINCT nt.news.id FROM NewsTag nt WHERE nt.tag.id IN :tagIds AND nt.news.id <> :excludeNewsId")
    List<Long> findDistinctNewsIdsByTagIdsExcludingNews(Set<Long> tagIds, Long excludeNewsId);
}
