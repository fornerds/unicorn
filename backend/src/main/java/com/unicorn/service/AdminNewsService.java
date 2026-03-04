package com.unicorn.service;

import com.unicorn.dto.admin.*;
import com.unicorn.entity.News;
import com.unicorn.entity.NewsTag;
import com.unicorn.entity.Tag;
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

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminNewsService {

    private final NewsRepository newsRepository;
    private final NewsTagRepository newsTagRepository;
    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public Page<AdminNewsListResponse> getList(String keyword, int page, int limit) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.min(100, Math.max(1, limit)), Sort.by("createdAt").descending());
        Page<News> pageResult = newsRepository.findAllForAdmin(keyword, pageable);
        return pageResult.map(n -> {
            List<AdminTagResponse> tags = newsTagRepository.findByNewsIdWithTag(n.getId()).stream()
                    .map(nt -> AdminTagResponse.builder().id(nt.getTag().getId()).name(nt.getTag().getName()).createdAt(nt.getTag().getCreatedAt()).build())
                    .collect(Collectors.toList());
            return AdminNewsListResponse.builder()
                    .id(n.getId())
                    .title(n.getTitle())
                    .imageUrl(n.getImageUrl())
                    .published(n.getPublished())
                    .viewCount(n.getViewCount())
                    .isFeatured(n.getIsFeatured())
                    .featuredOrder(n.getFeaturedOrder())
                    .createdAt(n.getCreatedAt())
                    .tags(tags)
                    .build();
        });
    }

    @Transactional(readOnly = true)
    public AdminNewsDetailResponse getDetail(Long id) {
        News n = newsRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("뉴스를 찾을 수 없습니다."));
        List<AdminTagResponse> tags = newsTagRepository.findByNewsIdWithTag(n.getId()).stream()
                .map(nt -> AdminTagResponse.builder().id(nt.getTag().getId()).name(nt.getTag().getName()).createdAt(nt.getTag().getCreatedAt()).build())
                .collect(Collectors.toList());
        return AdminNewsDetailResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .content(n.getContent())
                .imageUrl(n.getImageUrl())
                .published(n.getPublished())
                .publishedAt(n.getPublishedAt())
                .viewCount(n.getViewCount())
                .isFeatured(n.getIsFeatured())
                .featuredOrder(n.getFeaturedOrder())
                .createdAt(n.getCreatedAt())
                .updatedAt(n.getUpdatedAt())
                .tags(tags)
                .build();
    }

    @Transactional
    public AdminNewsDetailResponse create(AdminNewsRequest request) {
        News news = News.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .published(request.getPublished() != null ? request.getPublished() : false)
                .publishedAt(request.getPublishedAt())
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .featuredOrder(request.getFeaturedOrder())
                .build();
        news = newsRepository.save(news);
        syncNewsTags(news, request.getTagIds());
        return getDetail(news.getId());
    }

    @Transactional
    public AdminNewsDetailResponse update(Long id, AdminNewsRequest request) {
        News news = newsRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("뉴스를 찾을 수 없습니다."));
        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        news.setImageUrl(request.getImageUrl());
        if (request.getPublished() != null) {
            news.setPublished(request.getPublished());
        }
        news.setPublishedAt(request.getPublishedAt());
        if (request.getIsFeatured() != null) {
            news.setIsFeatured(request.getIsFeatured());
        }
        news.setFeaturedOrder(request.getFeaturedOrder());
        newsRepository.save(news);
        syncNewsTags(news, request.getTagIds());
        return getDetail(id);
    }

    @Transactional
    public void delete(Long id) {
        if (!newsRepository.existsById(id)) {
            throw new IllegalArgumentException("뉴스를 찾을 수 없습니다.");
        }
        newsRepository.deleteById(id);
    }

    private void syncNewsTags(News news, List<Long> tagIds) {
        if (tagIds == null) {
            tagIds = new ArrayList<>();
        }
        newsTagRepository.deleteByNews_Id(news.getId());
        for (Long tagId : tagIds) {
            Tag tag = tagRepository.findById(tagId).orElse(null);
            if (tag != null) {
                NewsTag nt = NewsTag.builder().news(news).tag(tag).build();
                newsTagRepository.save(nt);
            }
        }
    }
}
