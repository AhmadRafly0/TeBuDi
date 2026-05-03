package com.tebudi.TeBuDi.service;

import java.util.List;

import com.tebudi.TeBuDi.dto.BookRegisterDTO;
import com.tebudi.TeBuDi.dto.BookResponseDTO;
import com.tebudi.TeBuDi.dto.BookUpdateDTO;
import com.tebudi.TeBuDi.model.Book;

public interface BookService {
    List<Book> getAllBooks();
    BookResponseDTO getBookById(String id);
    
    BookResponseDTO saveBook(BookRegisterDTO book);
    BookResponseDTO updateBook(String id, BookUpdateDTO book);
    void deleteBook(String id);
}
