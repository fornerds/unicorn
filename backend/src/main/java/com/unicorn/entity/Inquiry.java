package com.unicorn.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "inquiries", indexes = {
        @Index(name = "idx_inquiries_created_at", columnList = "created_at"),
        @Index(name = "idx_inquiries_inquiry_type", columnList = "inquiry_type")
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
}
