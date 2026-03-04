package com.unicorn.service;

import com.unicorn.dto.admin.AdminTagRequest;
import com.unicorn.dto.admin.AdminTagResponse;
import com.unicorn.entity.Tag;
import com.unicorn.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminTagService {

    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public List<AdminTagResponse> getTags() {
        return tagRepository.findAllByOrderByNameAsc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminTagResponse create(AdminTagRequest request) {
        Tag tag = Tag.builder()
                .name(request.getName().trim())
                .build();
        tag = tagRepository.save(tag);
        return toResponse(tag);
    }

    @Transactional
    public AdminTagResponse update(Long id, AdminTagRequest request) {
        Tag tag = tagRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("태그를 찾을 수 없습니다."));
        tag.setName(request.getName().trim());
        tag = tagRepository.save(tag);
        return toResponse(tag);
    }

    @Transactional
    public void delete(Long id) {
        if (!tagRepository.existsById(id)) {
            throw new IllegalArgumentException("태그를 찾을 수 없습니다.");
        }
        tagRepository.deleteById(id);
    }

    private AdminTagResponse toResponse(Tag t) {
        return AdminTagResponse.builder()
                .id(t.getId())
                .name(t.getName())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
