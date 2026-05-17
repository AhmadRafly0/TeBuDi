// src/main/java/com/tebudi/TeBuDi/controller/BookController.java
package com.tebudi.TeBuDi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tebudi.TeBuDi.dto.ApiResponseDTO;
import com.tebudi.TeBuDi.dto.BookRegisterDTO;
import com.tebudi.TeBuDi.dto.BookResponseDTO;
import com.tebudi.TeBuDi.dto.BookUpdateDTO;
import com.tebudi.TeBuDi.dto.UserResponseDTO;
import com.tebudi.TeBuDi.service.BookService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    // ── Public (semua user login) ─────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<BookResponseDTO>>> getAllBooks() {
        List<BookResponseDTO> books = bookService.getAllBooks();
        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Daftar buku berhasil diambil", books));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponseDTO<List<BookResponseDTO>>> searchBooks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String author) {

        List<BookResponseDTO> books;
        if (title != null && !title.isBlank()) {
            books = bookService.searchByTitle(title);
        } else if (category != null && !category.isBlank()) {
            books = bookService.searchByCategory(category);
        } else if (author != null && !author.isBlank()) {
            books = bookService.searchByAuthor(author);
        } else {
            books = bookService.getAllBooks();
        }

        return ResponseEntity.ok(ApiResponseDTO.success("Pencarian buku berhasil", books));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<BookResponseDTO>> getBookById(@PathVariable String id) {
        BookResponseDTO data = bookService.getBookById(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Buku ditemukan!", data));
    }

    @GetMapping("/{id}/read")
    public ResponseEntity<?> readBookFile(@PathVariable String id, HttpSession session) {
        UserResponseDTO sessionUser = (UserResponseDTO) session.getAttribute("USER_SESSION");
        if (sessionUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponseDTO.error("Silakan login terlebih dahulu."));
        }

        try {
            String fileUrl = bookService.getBookFileUrl(id, sessionUser.getId());

            // Proxy PDF dari Cloudinary lewat backend agar URL tidak ter-expose ke frontend
            java.net.URL url = new java.net.URL(fileUrl);
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "TeBuDi-Server/1.0");
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(30000);
            conn.connect();

            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body(ApiResponseDTO.error("Gagal mengambil file dari cloud (HTTP " + responseCode + ")"));
            }

            byte[] pdfBytes;
            try (java.io.InputStream is = conn.getInputStream()) {
                pdfBytes = is.readAllBytes();
            }
            conn.disconnect();

            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"book_" + id + ".pdf\"")
                    .body(pdfBytes);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponseDTO.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponseDTO.error("Gagal melakukan streaming dokumen: " + e.getMessage()));
        }
    }

    // ── Admin only ────────────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<BookResponseDTO>> createBook(
            @Valid @ModelAttribute BookRegisterDTO request) {
        BookResponseDTO data = bookService.saveBook(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDTO.success("Buku berhasil ditambahkan!", data));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<BookResponseDTO>> updateBook(
            @PathVariable String id,
            @Valid @ModelAttribute BookUpdateDTO request) {
        BookResponseDTO data = bookService.updateBook(id, request);
        return ResponseEntity.ok(ApiResponseDTO.success("Data buku berhasil diperbarui!", data));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<Void>> deleteBook(@PathVariable String id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Buku berhasil dihapus", null));
    }
}