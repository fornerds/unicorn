package com.unicorn.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mood_questions", indexes = {
        @Index(name = "idx_mood_questions_sort_order", columnList = "sort_order")
})
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
