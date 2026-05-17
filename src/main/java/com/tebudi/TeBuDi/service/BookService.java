package com.tebudi.TeBuDi.service;

import java.util.List;

import com.tebudi.TeBuDi.dto.BookRegisterDTO;
import com.tebudi.TeBuDi.dto.BookResponseDTO;
import com.tebudi.TeBuDi.dto.BookUpdateDTO;
import org.springframework.core.io.Resource;

public interface BookService {
    List<BookResponseDTO> getAllBooks();

    List<BookResponseDTO> searchByTitle(String title);
    List<BookResponseDTO> searchByCategory(String categoryName);
    List<BookResponseDTO> searchByAuthor(String author);

    BookResponseDTO getBookById(String id);
    
    /**
     * Validasi akses user ke buku (cek premium/subscription) dan return URL file.
     * Untuk Cloudinary URL, koreksi resource_type jika perlu.
     */
    String getBookFileUrl(String bookId, String userId);

    BookResponseDTO saveBook(BookRegisterDTO book);
    BookResponseDTO updateBook(String id, BookUpdateDTO book);
    void deleteBook(String id);

    Resource getBookFileAsResource(String bookId, String userId);
}
