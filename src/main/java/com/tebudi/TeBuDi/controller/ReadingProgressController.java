package com.tebudi.TeBuDi.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tebudi.TeBuDi.dto.ApiResponseDTO;
import com.tebudi.TeBuDi.dto.ReadingProgressDTO;
import com.tebudi.TeBuDi.model.ReadingProgress;
import com.tebudi.TeBuDi.service.ReadingProgressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ReadingProgressController {

    private final ReadingProgressService progressService;

    @PutMapping("/{bookId}")
    public ResponseEntity<ApiResponseDTO<ReadingProgress>> saveProgress(
            @PathVariable String bookId,
            @RequestBody ReadingProgressDTO request,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        ReadingProgress data = progressService.updateProgress(userId, bookId, request);
        return ResponseEntity.ok(ApiResponseDTO.success("Progres berhasil disimpan", data));
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<ApiResponseDTO<ReadingProgress>> getBookProgress(
            @PathVariable String bookId,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        ReadingProgress data = progressService.getProgress(userId, bookId);
        return ResponseEntity.ok(ApiResponseDTO.success("Data progres ditemukan", data));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponseDTO<List<ReadingProgress>>> getHistory(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        List<ReadingProgress> data = progressService.getUserReadingHistory(userId);
        return ResponseEntity.ok(ApiResponseDTO.success("Histori baca berhasil diambil", data));
    }
}
