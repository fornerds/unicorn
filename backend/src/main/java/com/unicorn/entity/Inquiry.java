package com.unicorn.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "inquiries", indexes = {
        @Index(name = "idx_inquiries_created_at", columnList = "created_at"),
        @Index(name = "idx_inquiries_inquiry_type", columnList = "inquiry_type"),
        @Index(name = "idx_inquiries_status", columnList = "status")
})
@SQLRestriction("deleted_at IS NULL")
@SQLDelete(sql = "UPDATE inquiries SET deleted_at = CURRENT_TIMESTAMP(6) WHERE id = ?")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inquiry extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(length = 200)
    private String company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "inquiry_type", nullable = false, length = 50)
    private String inquiryType;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    /** 답변 상태: pending(미답변), answered(답변 발송 완료) */
    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "pending";

    /** 답변 메일 발송 시각 (1차 답변은 메일로만 발송, 이후는 메일에서 관리) */
    @Column(name = "replied_at")
    private java.time.Instant repliedAt;
}
