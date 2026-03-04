package com.unicorn.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_users_email", columnList = "email", unique = true),
        @Index(name = "idx_users_status", columnList = "status"),
        @Index(name = "idx_users_role", columnList = "role")
})
@SQLRestriction("deleted_at IS NULL")
@SQLDelete(sql = "UPDATE users SET deleted_at = CURRENT_TIMESTAMP(6) WHERE id = ?")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 512)
    private String avatar;

    @Column(length = 20)
    private String phone;

    @Column(name = "marketing_agreed", nullable = false)
    @Builder.Default
    private Boolean marketingAgreed = false;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "active";

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String role = "USER";
}
