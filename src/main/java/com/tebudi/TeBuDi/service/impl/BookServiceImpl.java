package com.tebudi.TeBuDi.service.impl;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.tebudi.TeBuDi.dto.BookRegisterDTO;
import com.tebudi.TeBuDi.dto.BookResponseDTO;
import com.tebudi.TeBuDi.dto.BookUpdateDTO;
import com.tebudi.TeBuDi.model.Book;
import com.tebudi.TeBuDi.model.Category;
import com.tebudi.TeBuDi.repository.BookRepository;
import com.tebudi.TeBuDi.repository.CategoryRepository;
import com.tebudi.TeBuDi.service.BookService;
import com.tebudi.TeBuDi.service.UserSubscriptionService;

@Service
public class BookServiceImpl implements BookService {

    @Autowired 
    private BookRepository bookRepository;

    @Autowired
    private UserSubscriptionService userSubscriptionService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private Cloudinary cloudinary; // Inject Cloudinary Bean

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDTO> getAllBooks(){
        return bookRepository.findAllWithCategory().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDTO> searchByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCaseWithCategory(title).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDTO> searchByCategory(String categoryName) {
        return bookRepository.findByCategoryNameContainingIgnoreCaseWithCategory(categoryName).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDTO> searchByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCaseWithCategory(author).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookResponseDTO getBookById(String id){
        Book book = bookRepository.findByIdWithCategory(id)
                    .orElseThrow(() -> new RuntimeException("Buku tidak ditemukan!"));
        return toResponse(book);
    }

    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public BookResponseDTO saveBook(BookRegisterDTO request) {
        if (bookRepository.existsById(request.getId())) {
            throw new RuntimeException("ID Book sudah terdaftar");
        }

        Category category = categoryRepository.findById(request.getCategory())
                .orElseThrow(() -> new RuntimeException("Kategori tidak ditemukan"));

        MultipartFile file = request.getBookFile();
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File buku wajib diunggah!");
        }

        try {
            // Upload ke Cloudinary dengan resource_type "raw" untuk file PDF/dokumen
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "tebudi/books",
                "resource_type", "raw"
            ));

            // Ambil secure URL (HTTPS) dari Cloudinary
            String cloudinaryUrl = (String) uploadResult.get("secure_url");

            Book book = new Book();
            book.setId(request.getId());
            book.setCategory(category);
            book.setTitle(request.getTitle());
            book.setAuthor(request.getAuthor());
            book.setDescription(request.getDescription());
            book.setCoverURL(request.getCoverURL());
            book.setFileURL(cloudinaryUrl); // Simpan URL Cloudinary penuh
            book.setIsPremium(request.getIsPremium());

            Book saved = bookRepository.save(book);
            return toResponse(saved);

        } catch (IOException e) {
            throw new RuntimeException("Gagal mengunggah file buku ke Cloudinary: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public BookResponseDTO updateBook(String id, BookUpdateDTO request) {
        Book book = bookRepository.findByIdWithCategory(id)
                    .orElseThrow(() -> new RuntimeException("Buku tidak ditemukan!"));

        if (request.getCategory() != null) {
            Category category = categoryRepository.findById(request.getCategory())
                    .orElseThrow(() -> new RuntimeException("Kategori tidak ditemukan"));
            book.setCategory(category);
        }
        if (StringUtils.hasText(request.getTitle()))       book.setTitle(request.getTitle());
        if (StringUtils.hasText(request.getAuthor()))      book.setAuthor(request.getAuthor());
        if (StringUtils.hasText(request.getDescription())) book.setDescription(request.getDescription());
        if (StringUtils.hasText(request.getCoverURL()))    book.setCoverURL(request.getCoverURL());  
        if (request.getIsPremium() != null)                book.setIsPremium(request.getIsPremium());

        MultipartFile newFile = request.getBookFile();
        if (newFile != null && !newFile.isEmpty()) {
            try {
                // Upload ke Cloudinary dengan resource_type "raw" untuk file PDF/dokumen
                Map uploadResult = cloudinary.uploader().upload(newFile.getBytes(), ObjectUtils.asMap(
                    "folder", "tebudi/books",
                    "resource_type", "raw"
                ));
                
                String cloudinaryUrl = (String) uploadResult.get("secure_url");
                book.setFileURL(cloudinaryUrl);

            } catch (IOException e) {
                throw new RuntimeException("Gagal memperbarui file buku ke Cloudinary: " + e.getMessage(), e);
            }
        }

        Book updated = bookRepository.save(book);
        return toResponse(updated);
    }

    @Override
    public void deleteBook(String id){
        // Opsional: hapus dari Cloudinary jika kamu menyimpan public_id di database
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
                .fileURL(book.getFileURL()) // Sekarang berisi link HTTPS Cloudinary
                .isPremium(book.getIsPremium())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public String getBookFileUrl(String bookId, String userId) {
        Book book = bookRepository.findByIdWithCategory(bookId)
                .orElseThrow(() -> new RuntimeException("Buku tidak ditemukan."));

        if (book.getIsPremium() && !userSubscriptionService.isUserSubscribed(userId)) {
            throw new RuntimeException("Akses ditolak. Buku ini memerlukan langganan premium aktif.");
        }

        String fileUrl = book.getFileURL();
        if (fileUrl == null || fileUrl.isBlank()) {
            throw new RuntimeException("File buku tidak tersedia.");
        }

        // Koreksi tidak diperlukan — file tersimpan di /image/upload/ di Cloudinary
        // Akses dikendalikan via Cloudinary delivery settings
        return fileUrl;
    }

    @Override
    public Resource getBookFileAsResource(String id, String userId) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Buku tidak ditemukan."));

        // Validasi langganan jika buku premium
        if (book.getIsPremium() && !userSubscriptionService.isUserSubscribed(userId)) {
            throw new RuntimeException("Akses ditolak. Buku ini memerlukan langganan premium aktif.");
        }

        try {
            String fileUrl = book.getFileURL();
            Resource resource;

            // Cek jika link berupa URL Cloudinary (Internet)
            if (fileUrl != null && (fileUrl.startsWith("http://") || fileUrl.startsWith("https://"))) {
                return new UrlResource(fileUrl);
            } else {
                // Jalur file lokal lama
                Path filePath = Paths.get(System.getProperty("user.dir"), "data-storage").resolve(fileUrl);
                resource = new UrlResource(filePath.toUri());

                if (resource.exists() && resource.isReadable()) {
                    return resource;
                } else {
                    throw new RuntimeException("File dokumen buku tidak dapat dibaca atau tidak ditemukan.");
                }
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Gagal membaca lokasi file buku: " + e.getMessage(), e);
        }
    }
}