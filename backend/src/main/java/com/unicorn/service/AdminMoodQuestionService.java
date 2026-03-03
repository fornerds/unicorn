package com.unicorn.service;

import com.unicorn.dto.admin.AdminMoodQuestionRequest;
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
public class AdminMoodQuestionService {

    private final MoodQuestionRepository moodQuestionRepository;

    @Transactional(readOnly = true)
    public List<MoodQuestionResponse> getMoodQuestions(int page, int limit) {
        return moodQuestionRepository.findAllByOrderBySortOrderAsc().stream()
                .skip((long) (page - 1) * limit)
                .limit(limit)
                .map(m -> MoodQuestionResponse.builder().id(m.getId()).question(m.getQuestion()).sortOrder(m.getSortOrder()).build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long count() {
        return moodQuestionRepository.count();
    }

    @Transactional
    public MoodQuestionResponse create(AdminMoodQuestionRequest request) {
        MoodQuestion m = MoodQuestion.builder()
                .question(request.getQuestion())
                .sortOrder(request.getSortOrder())
                .build();
        m = moodQuestionRepository.save(m);
        return MoodQuestionResponse.builder().id(m.getId()).question(m.getQuestion()).sortOrder(m.getSortOrder()).build();
    }

    @Transactional
    public MoodQuestionResponse update(Long id, AdminMoodQuestionRequest request) {
        MoodQuestion m = moodQuestionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("기분 질문을 찾을 수 없습니다."));
        m.setQuestion(request.getQuestion());
        m.setSortOrder(request.getSortOrder());
        m = moodQuestionRepository.save(m);
        return MoodQuestionResponse.builder().id(m.getId()).question(m.getQuestion()).sortOrder(m.getSortOrder()).build();
    }

    @Transactional
    public void delete(Long id) {
        if (!moodQuestionRepository.existsById(id)) {
            throw new IllegalArgumentException("기분 질문을 찾을 수 없습니다.");
        }
        moodQuestionRepository.deleteById(id);
    }
}
