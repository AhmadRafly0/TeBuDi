package com.tebudi.TeBuDi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="books")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Book {
    @Id
    @Column(
        name="book_id",
        nullable=false,
        length=50
    )
    private String id;

    @Column(
        name="category_id",
        nullable=false
    )
    private int category;

    @Column(nullable=false)
    private String title;

    @Column(length=100)
    private String author;

    @Column(columnDefinition="TEXT")
    private String description;

    @Column(name="cover_url")
    private String coverURL;

    @Column(
        name="file_url",    
        nullable=false
    )
    private String fileURL;

    @Column(
        name="is_premium",
        nullable=false,
        columnDefinition="TINYINT(1)"
    )
    private boolean isPremium;

    
}
