package com.tebudi.TeBuDi.service;

import java.util.List;
import java.util.Optional;

import com.tebudi.TeBuDi.model.Book;

public interface BookService {
    List<Book> getAllBooks();
    Optional<Book> getBookById(String id);
    
    Book saveBook(Book book);
    Book updateBook(String id, Book book);
    void deleteBook(String id);
}
