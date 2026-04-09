package com.tebudi.TeBuDi.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tebudi.TeBuDi.model.Book;
import com.tebudi.TeBuDi.repository.BookRepository;
import com.tebudi.TeBuDi.service.BookService;

@Service
public class BookServiceImpl implements BookService{
    @Autowired 
    private BookRepository bookRepository;

    @Override
    public List<Book> getAllBooks(){
        return bookRepository.findAll();
    }

    @Override 
    public Optional<Book> getBookById(String id){
        return bookRepository.findById(id);
    }

    @Override
    public Book saveBook(Book book){
        return bookRepository.save(book);
    }

    @Override
    public Book updateBook(String id, Book bookDetails) {
        return bookRepository.findById(id).map(book -> {
            book.setCategory(bookDetails.getCategory());
            book.setTitle(bookDetails.getTitle());
            book.setAuthor(bookDetails.getAuthor());
            book.setDescription(bookDetails.getDescription());
            book.setCoverURL(bookDetails.getCoverURL());
            book.setFileURL(bookDetails.getFileURL());
           
            return bookRepository.save(book);
        }).orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }

    @Override
    public void deleteBook(String id){
        bookRepository.deleteById(id);  
    }
}