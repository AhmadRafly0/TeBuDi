package com.tebudi.TeBuDi.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tebudi.TeBuDi.model.Book;


@Repository
public interface BookRepository extends JpaRepository<Book, String>{

    // JOIN FETCH agar category langsung di-load dalam satu query (hindari lazy loading error)
    @Query("SELECT b FROM Book b JOIN FETCH b.category")
    List<Book> findAllWithCategory();

    @Query("SELECT b FROM Book b JOIN FETCH b.category WHERE b.id = :id")
    Optional<Book> findByIdWithCategory(@Param("id") String id);

    @Query("SELECT b FROM Book b JOIN FETCH b.category WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Book> findByTitleContainingIgnoreCaseWithCategory(@Param("title") String title);

    @Query("SELECT b FROM Book b JOIN FETCH b.category WHERE LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%'))")
    List<Book> findByAuthorContainingIgnoreCaseWithCategory(@Param("author") String author);

    @Query("SELECT b FROM Book b JOIN FETCH b.category WHERE LOWER(b.category.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Book> findByCategoryNameContainingIgnoreCaseWithCategory(@Param("name") String name);

    // Method lama tetap ada untuk kompatibilitas
    Optional<Book> findByTitle(String title);
    Optional<Book> findByAuthor(String author);
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByAuthorContainingIgnoreCase(String author);
    List<Book> findByCategoryNameContainingIgnoreCase(String categoryName);
}
