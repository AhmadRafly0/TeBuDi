package com.tebudi.TeBuDi.repository;

import com.tebudi.TeBuDi.model.ReadingProgress;
import com.tebudi.TeBuDi.model.User;
import com.tebudi.TeBuDi.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {
    Optional<ReadingProgress> findByUserAndBook(User user, Book book);
    Optional<ReadingProgress> findByUserIdAndBookId(String userId, String bookId);
    List<ReadingProgress> findByUserIdOrderByLastReadAtDesc(String userId);
}