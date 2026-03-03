package com.unicorn.repository;

import com.unicorn.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByParent_IdOrderBySortOrderAsc(Long parentId);

    List<Category> findByParentIsNullOrderBySortOrderAsc();
}
