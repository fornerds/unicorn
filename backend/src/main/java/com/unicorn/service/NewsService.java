package com.unicorn.service;

import com.unicorn.dto.news.*;
import com.unicorn.entity.News;
import com.unicorn.entity.NewsTag;
import com.unicorn.repository.NewsRepository;
import com.unicorn.repository.NewsTagRepository;
import com.unicorn.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewsService {

    private static final int RELATED_ARTICLES_LIMIT = 4;
    private static final int DEFAULT_POPULAR_LIMIT = 10;
    private static final int DEFAULT_FEATURED_LIMIT = 10;

    private final NewsRepository newsRepository;
    private final NewsTagRepository newsTagRepository;
    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public Page<NewsListResponse> getList(String keyword, List<Long> tagIds, int page, int limit) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.min(100, Math.max(1, limit)), Sort.by("createdAt").descending());
        Page<News> pageResult = (tagIds != null && !tagIds.isEmpty())
                ? newsRepository.findPublishedByKeywordAndTagIds(keyword, tagIds, pageable)
                : newsRepository.findPublishedByKeyword(keyword, pageable);
        return pageResult.map(this::toListResponse);
    }

    @Transactional
    public NewsDetailResponse getDetail(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("뉴스를 찾을 수 없습니다."));
        if (!Boolean.TRUE.equals(news.getPublished())) {
            throw new IllegalArgumentException("뉴스를 찾을 수 없습니다.");
        }
        newsRepository.incrementViewCount(id);
        news.setViewCount(news.getViewCount() + 1);

        List<NewsTag> newsTags = newsTagRepository.findByNewsIdWithTag(id);
        List<TagResponse> tags = newsTags.stream()
                .map(nt -> TagResponse.builder()
                        .id(nt.getTag().getId())
                        .name(nt.getTag().getName())
                        .build())
                .collect(Collectors.toList());

        Set<Long> tagIds = newsTags.stream().map(nt -> nt.getTag().getId()).collect(Collectors.toSet());
        List<NewsRelatedItemResponse> related = findRelatedArticles(id, tagIds);
        return NewsDetailResponse.builder()
                .id(news.getId())
                .imageUrl(news.getImageUrl())
                .title(news.getTitle())
                .content(news.getContent())
                .viewCount(news.getViewCount())
                .publishedAt(news.getPublishedAt())
                .createdAt(news.getCreatedAt())
                .tags(tags)
                .relatedArticles(related)
                .build();
    }

    private List<NewsRelatedItemResponse> findRelatedArticles(Long excludeNewsId, Set<Long> tagIds) {
        List<Long> relatedIds = new ArrayList<>();
        if (tagIds != null && !tagIds.isEmpty()) {
            relatedIds = newsTagRepository.findDistinctNewsIdsByTagIdsExcludingNews(tagIds, excludeNewsId);
        }
        List<News> relatedNews;
        if (relatedIds.isEmpty()) {
            relatedNews = newsRepository.findPublishedByKeyword(null, PageRequest.of(0, RELATED_ARTICLES_LIMIT + 1))
                    .getContent().stream()
                    .filter(n -> !n.getId().equals(excludeNewsId))
                    .limit(RELATED_ARTICLES_LIMIT)
                    .collect(Collectors.toList());
        } else {
            relatedNews = newsRepository.findByIdInOrderByCreatedAtDesc(relatedIds).stream()
                    .limit(RELATED_ARTICLES_LIMIT)
                    .collect(Collectors.toList());
        }
        return relatedNews.stream().map(this::toRelatedItemResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NewsListResponse> getPopularByViewCount(int limit) {
        int size = limit > 0 ? Math.min(limit, 50) : DEFAULT_POPULAR_LIMIT;
        List<News> list = newsRepository.findPublishedOrderByViewCountDesc(PageRequest.of(0, size));
        return list.stream().map(this::toListResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NewsListResponse> getFeatured(int limit) {
        int size = limit > 0 ? Math.min(limit, 50) : DEFAULT_FEATURED_LIMIT;
        List<News> list = newsRepository.findPublishedFeaturedOrderByFeaturedOrder(PageRequest.of(0, size));
        return list.stream().map(this::toListResponse).collect(Collectors.toList());
    }

    private NewsListResponse toListResponse(News n) {
        return NewsListResponse.builder()
                .id(n.getId())
                .imageUrl(n.getImageUrl())
                .title(n.getTitle())
                .content(n.getContent())
                .createdAt(n.getCreatedAt())
                .build();
    }

    private NewsRelatedItemResponse toRelatedItemResponse(News n) {
        return NewsRelatedItemResponse.builder()
                .id(n.getId())
                .imageUrl(n.getImageUrl())
                .title(n.getTitle())
                .content(n.getContent())
                .createdAt(n.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<TagResponse> getTags() {
        return tagRepository.findAllByOrderByNameAsc().stream()
                .map(t -> TagResponse.builder().id(t.getId()).name(t.getName()).build())
                .collect(Collectors.toList());
    }
}
