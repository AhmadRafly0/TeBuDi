package com.tebudi.TeBuDi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tebudi.TeBuDi.model.Book;


@Repository
public interface BookRepository extends JpaRepository<Book, String>{
    Optional<Book> findByTitle(String title);
    Optional<Book> findByAuthor(String author);
    
}
