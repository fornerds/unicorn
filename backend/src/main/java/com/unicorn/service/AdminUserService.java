package com.unicorn.service;

import com.unicorn.dto.admin.AdminUpdateUserRequest;
import com.unicorn.dto.admin.AdminUserDetailResponse;
import com.unicorn.dto.admin.AdminUserListResponse;
import com.unicorn.entity.User;
import com.unicorn.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<AdminUserListResponse> getUsers(String keyword, int page, int limit) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.min(100, Math.max(1, limit)));
        Page<User> users = userRepository.findByKeyword(keyword, pageable);
        return users.map(this::toListResponse);
    }

    @Transactional(readOnly = true)
    public AdminUserDetailResponse getUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        return toDetailResponse(user);
    }

    @Transactional
    public AdminUserDetailResponse updateUser(Long id, AdminUpdateUserRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        if (request.getStatus() != null) user.setStatus(request.getStatus());
        if (request.getMemo() != null) user.setMemo(request.getMemo());
        user = userRepository.save(user);
        return toDetailResponse(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }
        userRepository.deleteById(id);
    }

    private AdminUserListResponse toListResponse(User u) {
        return AdminUserListResponse.builder()
                .id(u.getId())
                .email(u.getEmail())
                .name(u.getName())
                .avatar(u.getAvatar())
                .phone(u.getPhone())
                .status(u.getStatus())
                .createdAt(u.getCreatedAt())
                .build();
    }

    private AdminUserDetailResponse toDetailResponse(User u) {
        return AdminUserDetailResponse.builder()
                .id(u.getId())
                .email(u.getEmail())
                .name(u.getName())
                .avatar(u.getAvatar())
                .phone(u.getPhone())
                .status(u.getStatus())
                .memo(u.getMemo())
                .createdAt(u.getCreatedAt())
                .updatedAt(u.getUpdatedAt())
                .build();
    }
}
