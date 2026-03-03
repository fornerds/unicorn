package com.unicorn.service;

import com.unicorn.dto.category.CategoryResponse;
import com.unicorn.entity.Category;
import com.unicorn.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getCategories(UUID parentId) {
        List<Category> categories = parentId == null
                ? categoryRepository.findByParentIsNullOrderBySortOrderAsc()
                : categoryRepository.findByParent_IdOrderBySortOrderAsc(parentId);
        return categories.stream()
                .map(c -> toResponse(c, true))
                .collect(Collectors.toList());
    }

    private CategoryResponse toResponse(Category c, boolean withChildren) {
        List<CategoryResponse> children = List.of();
        if (withChildren) {
            List<Category> childList = categoryRepository.findByParent_IdOrderBySortOrderAsc(c.getId());
            children = childList.stream().map(child -> toResponse(child, false)).collect(Collectors.toList());
        }
        return CategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .slug(c.getSlug())
                .imageUrl(c.getImageUrl())
                .sortOrder(c.getSortOrder())
                .children(children)
                .build();
    }
}
