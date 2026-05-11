package com.tebudi.TeBuDi.controller;

import com.tebudi.TeBuDi.dto.ApiResponseDTO;
import com.tebudi.TeBuDi.dto.ReadingProgressDTO;
import com.tebudi.TeBuDi.dto.UserResponseDTO;
import com.tebudi.TeBuDi.model.ReadingProgress;
import com.tebudi.TeBuDi.service.ReadingProgressService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ReadingProgressController {

    private final ReadingProgressService progressService;

    @PutMapping("/{bookId}")
    public ResponseEntity<ApiResponseDTO<ReadingProgress>> saveProgress(
            @PathVariable String bookId,
            @RequestBody ReadingProgressDTO request,
            HttpSession session) {

        UserResponseDTO sessionUser = (UserResponseDTO) session.getAttribute("USER_SESSION");
        if (sessionUser == null) return ResponseEntity.status(401).body(ApiResponseDTO.error("Silakan login"));

        ReadingProgress data = progressService.updateProgress(sessionUser.getId(), bookId, request);
        return ResponseEntity.ok(ApiResponseDTO.success("Progres berhasil disimpan", data));
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<ApiResponseDTO<ReadingProgress>> getBookProgress(
            @PathVariable String bookId,
            HttpSession session) {

        UserResponseDTO sessionUser = (UserResponseDTO) session.getAttribute("USER_SESSION");
        if (sessionUser == null) return ResponseEntity.status(401).body(ApiResponseDTO.error("Silakan login"));

        ReadingProgress data = progressService.getProgress(sessionUser.getId(), bookId);
        return ResponseEntity.ok(ApiResponseDTO.success("Data progres ditemukan", data));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponseDTO<List<ReadingProgress>>> getHistory(HttpSession session) {
        UserResponseDTO sessionUser = (UserResponseDTO) session.getAttribute("USER_SESSION");
        if (sessionUser == null) return ResponseEntity.status(401).body(ApiResponseDTO.error("Silakan login"));

        List<ReadingProgress> data = progressService.getUserReadingHistory(sessionUser.getId());
        return ResponseEntity.ok(ApiResponseDTO.success("Histori baca berhasil diambil", data));
    }
}