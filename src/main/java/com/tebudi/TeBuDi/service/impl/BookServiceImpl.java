package com.tebudi.TeBuDi.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.tebudi.TeBuDi.dto.BookRegisterDTO;
import com.tebudi.TeBuDi.dto.BookResponseDTO;
import com.tebudi.TeBuDi.dto.BookUpdateDTO;
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
    public BookResponseDTO getBookById(String id){
        Book book = bookRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Buku tidak ditemukan!"));
        
        return toResponse(book);
    }

    @Override
    public BookResponseDTO saveBook(BookRegisterDTO request){
        
        if(bookRepository.existsById(request.getId())){
            throw new RuntimeException("ID Book sudah terdaftar");
        }

        Book book = new Book();
        book.setId(request.getId());
        book.setCategory(request.getCategory());
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setDescription(request.getDescription());
        book.setCoverURL(request.getCoverURL());
        book.setFileURL(request.getFileURL());
        book.setIsPremium(request.getIsPremium());

        Book saved = bookRepository.save(book);

        return toResponse(saved);
    }

    @Override
    public BookResponseDTO updateBook(String id, BookUpdateDTO request) {

        Book book = bookRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Buku tidak ditemukan!"));

        if(request.getCategory() != null)                book.setCategory(request.getCategory());
        if(StringUtils.hasText(request.getTitle()))      book.setTitle(request.getTitle());
        if(StringUtils.hasText(request.getAuthor()))     book.setAuthor(request.getAuthor());
        if(StringUtils.hasText(request.getDescription()))book.setDescription(request.getDescription());
        if(StringUtils.hasText(request.getCoverURL()))   book.setAuthor(request.getCoverURL());
        if(StringUtils.hasText(request.getFileURL()))    book.setAuthor(request.getFileURL());
        if(request.getIsPremium() != null)               book.setIsPremium(request.getIsPremium());

        Book updated = bookRepository.save(book);

        return toResponse(updated);
    }

    @Override
    public void deleteBook(String id){
        bookRepository.deleteById(id);  
    }

    public BookResponseDTO toResponse(Book book) {
        return BookResponseDTO.builder()
                .id(book.getId())
                .category(book.getCategory())
                .title(book.getTitle())
                .author(book.getAuthor())
                .description(book.getDescription())
                .coverURL(book.getCoverURL())
                .fileURL(book.getFileURL())
                .isPremium(book.getIsPremium())
                .build();
    }
}