package com.unicorn.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sns_accounts", indexes = {
        @Index(name = "uk_sns_accounts_provider_user", columnList = "provider, provider_user_id", unique = true),
        @Index(name = "idx_sns_accounts_user_id", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SnsAccount extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 30)
    private String provider;

    @Column(name = "provider_user_id", nullable = false, length = 100)
    private String providerUserId;
}
