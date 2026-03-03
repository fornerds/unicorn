package com.unicorn.service;

import com.unicorn.dto.admin.AdminCategoryRequest;
import com.unicorn.dto.admin.AdminCategoryResponse;
import com.unicorn.entity.Category;
import com.unicorn.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminCategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<AdminCategoryResponse> getCategories(UUID parentId) {
        List<Category> list = parentId == null
                ? categoryRepository.findByParentIsNullOrderBySortOrderAsc()
                : categoryRepository.findByParent_IdOrderBySortOrderAsc(parentId);
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public AdminCategoryResponse create(AdminCategoryRequest request) {
        Category parent = request.getParentId() != null ? categoryRepository.getReferenceById(request.getParentId()) : null;
        Category c = Category.builder()
                .parent(parent)
                .name(request.getName())
                .slug(request.getSlug())
                .sortOrder(request.getSortOrder())
                .build();
        c = categoryRepository.save(c);
        return toResponse(c);
    }

    @Transactional
    public AdminCategoryResponse update(UUID id, AdminCategoryRequest request) {
        Category c = categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));
        c.setName(request.getName());
        c.setSlug(request.getSlug());
        c.setSortOrder(request.getSortOrder());
        if (request.getParentId() != null) {
            c.setParent(categoryRepository.getReferenceById(request.getParentId()));
        } else {
            c.setParent(null);
        }
        c = categoryRepository.save(c);
        return toResponse(c);
    }

    @Transactional
    public void delete(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("카테고리를 찾을 수 없습니다.");
        }
        categoryRepository.deleteById(id);
    }

    private AdminCategoryResponse toResponse(Category c) {
        return AdminCategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .slug(c.getSlug())
                .parentId(c.getParent() != null ? c.getParent().getId() : null)
                .sortOrder(c.getSortOrder())
                .createdAt(c.getCreatedAt())
                .children(List.of())
                .build();
    }
}
