package com.tebudi.TeBuDi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tebudi.TeBuDi.dto.ApiResponseDTO;
import com.tebudi.TeBuDi.dto.UserResponseDTO;
import com.tebudi.TeBuDi.dto.UserSubscriptionDTO;
import com.tebudi.TeBuDi.service.UserSubscriptionService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/userSubs")
@RequiredArgsConstructor
public class UserSubscriptionController {
    
    private final UserSubscriptionService userSubscriptionService;
    
    @GetMapping("/status")
    public ResponseEntity<ApiResponseDTO<UserSubscriptionDTO>> checkSubscriptionStatus(HttpSession session) {

        UserResponseDTO sessionUser = (UserResponseDTO) session.getAttribute("USER_SESSION");

        if (sessionUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponseDTO.error("Session tidak ditemukan, silakan login kembali"));
        }

        String userId = sessionUser.getId();

        UserSubscriptionDTO data = userSubscriptionService.getSubscriptionDetails(userId);

        return ResponseEntity.ok(ApiResponseDTO.success("Data status langganan berhasil ditarik!" , data));
    }
}
