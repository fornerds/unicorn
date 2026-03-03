package com.unicorn.repository;

import com.unicorn.entity.MoodQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface MoodQuestionRepository extends JpaRepository<MoodQuestion, Long> {

    List<MoodQuestion> findAllByOrderBySortOrderAsc();
}
