package com.unicorn.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "mood_questions", indexes = {
        @Index(name = "idx_mood_questions_sort_order", columnList = "sort_order")
})
@SQLRestriction("deleted_at IS NULL")
@SQLDelete(sql = "UPDATE mood_questions SET deleted_at = CURRENT_TIMESTAMP(6) WHERE id = ?")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MoodQuestion extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String question;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
