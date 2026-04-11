package com.tebudi.TeBuDi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tebudi.TeBuDi.dto.ApiResponseDTO; 
import com.tebudi.TeBuDi.model.Book;
import com.tebudi.TeBuDi.service.BookService;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<Book>>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Daftar buku berhasil diambil", books));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Book>> getBookById(@PathVariable String id) {
        return bookService.getBookById(id)
                .map(book -> ResponseEntity.ok(new ApiResponseDTO<>(true, "Buku ditemukan", book)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponseDTO<>(false, "Buku tidak ditemukan", null)));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDTO<Book>> createBook(@RequestBody Book book) {
        Book savedBook = bookService.saveBook(book);
        return new ResponseEntity<>(
            new ApiResponseDTO<>(true, "Buku berhasil ditambahkan!", savedBook), 
            HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Book>> updateBook(@PathVariable String id, @RequestBody Book bookDetails) {
        try {
            Book updatedBook = bookService.updateBook(id, bookDetails);
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Data buku berhasil diperbarui", updatedBook));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponseDTO<>(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Void>> deleteBook(@PathVariable String id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Buku berhasil dihapus", null));
    }
}