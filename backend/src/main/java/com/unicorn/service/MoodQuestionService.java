package com.unicorn.service;

import com.unicorn.dto.ai.MoodQuestionResponse;
import com.unicorn.entity.MoodQuestion;
import com.unicorn.repository.MoodQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MoodQuestionService {

    private final MoodQuestionRepository moodQuestionRepository;

    @Transactional(readOnly = true)
    public List<MoodQuestionResponse> getMoodQuestions(int page, int limit) {
        return moodQuestionRepository.findAllByOrderBySortOrderAsc().stream()
                .skip((long) (page - 1) * limit)
                .limit(limit)
                .map(m -> MoodQuestionResponse.builder()
                        .id(m.getId())
                        .question(m.getQuestion())
                        .sortOrder(m.getSortOrder())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countMoodQuestions() {
        return moodQuestionRepository.count();
    }
}
