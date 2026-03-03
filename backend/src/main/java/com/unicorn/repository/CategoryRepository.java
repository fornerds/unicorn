package com.unicorn.repository;

import com.unicorn.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {

    List<Category> findByParent_IdOrderBySortOrderAsc(UUID parentId);

    List<Category> findByParentIsNullOrderBySortOrderAsc();
}
