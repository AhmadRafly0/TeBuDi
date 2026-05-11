package com.tebudi.TeBuDi.service.impl;

import com.tebudi.TeBuDi.dto.ReadingProgressDTO;
import com.tebudi.TeBuDi.model.Book;
import com.tebudi.TeBuDi.model.ReadingProgress;
import com.tebudi.TeBuDi.model.User;
import com.tebudi.TeBuDi.repository.BookRepository;
import com.tebudi.TeBuDi.repository.ReadingProgressRepository;
import com.tebudi.TeBuDi.repository.UserRepository;
import com.tebudi.TeBuDi.service.ReadingProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReadingProgressServiceImpl implements ReadingProgressService {

    private final ReadingProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Override
    @Transactional
    public ReadingProgress updateProgress(String userId, String bookId, ReadingProgressDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Buku tidak ditemukan"));

        ReadingProgress progress = progressRepository.findByUserAndBook(user, book)
                .orElse(new ReadingProgress());

        progress.setUser(user);
        progress.setBook(book);

        progress.setCurrentPage(request.getCurrentPage());
        progress.setLastPage(request.getCurrentPage());

        if (request.getTotalPages() != null && request.getTotalPages() > 0) {
            progress.setTotalPages(request.getTotalPages());
        }

        return progressRepository.save(progress);
    }

    @Override
    public ReadingProgress getProgress(String userId, String bookId) {
        return progressRepository.findByUserIdAndBookId(userId, bookId).orElse(null);
    }

    @Override
    public List<ReadingProgress> getUserReadingHistory(String userId) {
        return progressRepository.findByUserIdOrderByLastReadAtDesc(userId);
    }
}
