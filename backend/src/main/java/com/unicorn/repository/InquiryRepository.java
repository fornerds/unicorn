package com.unicorn.repository;

import com.unicorn.entity.Inquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    Page<Inquiry> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT i FROM Inquiry i WHERE (:inquiryType IS NULL OR :inquiryType = '' OR i.inquiryType = :inquiryType) " +
            "AND (:status IS NULL OR :status = '' OR i.status = :status)")
    Page<Inquiry> findByInquiryTypeAndStatus(@Param("inquiryType") String inquiryType, @Param("status") String status, Pageable pageable);
}
