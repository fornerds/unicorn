package com.unicorn.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "tags", indexes = {
        @Index(name = "uk_tags_name", columnList = "name", unique = true)
})
@SQLRestriction("deleted_at IS NULL")
@SQLDelete(sql = "UPDATE tags SET deleted_at = CURRENT_TIMESTAMP(6) WHERE id = ?")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;
}
