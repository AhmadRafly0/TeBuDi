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
import com.tebudi.TeBuDi.dto.BookRegisterDTO;
import com.tebudi.TeBuDi.dto.BookResponseDTO;
import com.tebudi.TeBuDi.dto.BookUpdateDTO;
import com.tebudi.TeBuDi.model.Book;
import com.tebudi.TeBuDi.service.BookService;

import jakarta.validation.Valid;

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
    public ResponseEntity<ApiResponseDTO<BookResponseDTO>> getBookById(@PathVariable String id) {
        BookResponseDTO data = bookService.getBookById(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Buku ditemukan!", data));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDTO<BookResponseDTO>> createBook(@Valid @RequestBody BookRegisterDTO request) {
        BookResponseDTO data = bookService.saveBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponseDTO.success("Buku berhasil ditambahkan!", data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<BookResponseDTO>> updateBook(@PathVariable String id,@Valid @RequestBody BookUpdateDTO request) {
        BookResponseDTO data = bookService.updateBook(id, request);
        return ResponseEntity.ok(ApiResponseDTO.success("Data buku berhasil diperbarui!", data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Void>> deleteBook(@PathVariable String id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Buku berhasil dihapus", null));
    }
}