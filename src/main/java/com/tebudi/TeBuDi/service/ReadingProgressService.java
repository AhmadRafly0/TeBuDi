package com.tebudi.TeBuDi.service;

import com.tebudi.TeBuDi.dto.ReadingProgressDTO;
import com.tebudi.TeBuDi.model.ReadingProgress;
import java.util.List;

public interface ReadingProgressService {
    ReadingProgress updateProgress(String userId, String bookId, ReadingProgressDTO request);
    ReadingProgress getProgress(String userId, String bookId);
    List<ReadingProgress> getUserReadingHistory(String userId);
}
