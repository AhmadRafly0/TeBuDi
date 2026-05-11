package com.tebudi.TeBuDi.service.impl;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
//import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.tebudi.TeBuDi.dto.BookRegisterDTO;
import com.tebudi.TeBuDi.dto.BookResponseDTO;
import com.tebudi.TeBuDi.dto.BookUpdateDTO;
import com.tebudi.TeBuDi.exception.UnauthorizedException;
import com.tebudi.TeBuDi.model.Book;
import com.tebudi.TeBuDi.model.Category;
import com.tebudi.TeBuDi.repository.BookRepository;
import com.tebudi.TeBuDi.repository.CategoryRepository;
import com.tebudi.TeBuDi.service.BookService;
import com.tebudi.TeBuDi.service.UserSubscriptionService;

@Service
public class BookServiceImpl implements BookService{
   
    @Autowired 
    private BookRepository bookRepository;

    @Autowired
    private UserSubscriptionService userSubscriptionService;

    @Autowired
    private CategoryRepository categoryRepository;


    @Override
    public List<Book> getAllBooks(){
        return bookRepository.findAll();
    }

    @Override
    public List<Book> searchByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    @Override
    public List<Book> searchByCategory(String categoryName) {
        return bookRepository.findByCategoryNameContainingIgnoreCase(categoryName);
    }

    @Override
    public List<Book> searchByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author);
    }

    @Override 
    public BookResponseDTO getBookById(String id){
        Book book = bookRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Buku tidak ditemukan!"));
        
        return toResponse(book);
    }

    @Override
    public BookResponseDTO saveBook(BookRegisterDTO request) {

        if (bookRepository.existsById(request.getId())) {
            throw new RuntimeException("ID Book sudah terdaftar");
        }

        Category category = categoryRepository.findById(request.getCategory())
                .orElseThrow(() -> new RuntimeException("Kategori tidak ditemukan"));

        MultipartFile file = request.getBookFile();

        // Folder relatif terhadap project root (user.dir)
        String relativeFolderPath = "data-storage" + File.separator + "books";
        Path uploadPath = Paths.get(System.getProperty("user.dir"), relativeFolderPath);

        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Sanitasi nama file agar aman
            String originalFilename = StringUtils.cleanPath(
                Objects.requireNonNull(file.getOriginalFilename())
            );
            String fileName = UUID.randomUUID().toString() + "_" + originalFilename;

            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // ✅ Simpan sebagai relative path — portable di semua laptop
            String relativeFileURL = "books/" + fileName;

            Book book = new Book();
            book.setId(request.getId());
            book.setCategory(category);
            book.setTitle(request.getTitle());
            book.setAuthor(request.getAuthor());
            book.setDescription(request.getDescription());
            book.setCoverURL(request.getCoverURL());
            book.setFileURL(relativeFileURL); // ✅ relative, bukan absolute
            book.setIsPremium(request.getIsPremium());

            Book saved = bookRepository.save(book);
            return toResponse(saved);

        } catch (IOException e) {
            throw new RuntimeException("Gagal menyimpan file buku: " + e.getMessage(), e);
        }
    }

    @Override
    public BookResponseDTO updateBook(String id, BookUpdateDTO request) {

        Book book = bookRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Buku tidak ditemukan!"));

        // ── Update field teks ──────────────────────────────────────────────────
        if (request.getCategory() != null) {
            Category category = categoryRepository.findById(request.getCategory())
                    .orElseThrow(() -> new RuntimeException("Kategori tidak ditemukan"));
            book.setCategory(category);
        }
        if (StringUtils.hasText(request.getTitle()))       book.setTitle(request.getTitle());
        if (StringUtils.hasText(request.getAuthor()))      book.setAuthor(request.getAuthor());
        if (StringUtils.hasText(request.getDescription())) book.setDescription(request.getDescription());
        if (StringUtils.hasText(request.getCoverURL()))    book.setCoverURL(request.getCoverURL());  // ✅ fix bug
        if (request.getIsPremium() != null)                book.setIsPremium(request.getIsPremium());

        // ── Update file PDF (opsional) ─────────────────────────────────────────
        MultipartFile newFile = request.getBookFile();
        if (newFile != null && !newFile.isEmpty()) {

            String uploadDir = Paths.get(System.getProperty("user.dir"), "data-storage", "books")
                                    .toAbsolutePath().toString();
            Path uploadPath = Paths.get(uploadDir);

            try {
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                // Hapus file lama dari disk
                if (StringUtils.hasText(book.getFileURL())) {
                    // fileURL tersimpan sebagai "books/namafile.pdf"
                    // data-storage + "books/namafile.pdf" → path lengkap file lama
                    Path oldFile = Paths.get(System.getProperty("user.dir"), "data-storage", book.getFileURL());
                    Files.deleteIfExists(oldFile);
                }

                // Simpan file baru
                String sanitized = StringUtils.cleanPath(
                    Objects.requireNonNull(newFile.getOriginalFilename())
                );
                String newFileName = UUID.randomUUID() + "_" + sanitized;
                Path target = uploadPath.resolve(newFileName);
                Files.copy(newFile.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

                // Simpan relative path
                book.setFileURL("books/" + newFileName);

            } catch (IOException e) {
                throw new RuntimeException("Gagal memperbarui file buku: " + e.getMessage(), e);
            }
        }

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
                .categoryId(book.getCategory().getId())      
                .categoryName(book.getCategory().getName())   
                .title(book.getTitle())
                .author(book.getAuthor())
                .description(book.getDescription())
                .coverURL(book.getCoverURL())
                .fileURL(book.getFileURL())
                .isPremium(book.getIsPremium())
                .build();
    }

    @Override
    public Resource getBookFileAsResource(String bookId, String userId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Buku tidak ditemukan!"));

        if (Boolean.TRUE.equals(book.getIsPremium())) {
            if (userId == null || !userSubscriptionService.isUserSubscribed(userId)) {
                throw new UnauthorizedException("Akses ditolak! Kamu harus berlangganan paket premium untuk membaca buku ini.");
            }
        }
        try {
            Path filePath = Paths.get(System.getProperty("user.dir"), "data-storage", book.getFileURL()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File dokumen buku tidak ditemukan di server.");
            }
        } catch (RuntimeException | MalformedURLException e) {
            throw new RuntimeException("Gagal membaca file buku: " + e.getMessage(), e);
        }
    }


}