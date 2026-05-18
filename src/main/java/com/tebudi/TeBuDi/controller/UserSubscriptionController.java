package com.tebudi.TeBuDi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tebudi.TeBuDi.dto.ApiResponseDTO;
import com.tebudi.TeBuDi.dto.UserSubscriptionDTO;
import com.tebudi.TeBuDi.service.UserSubscriptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/userSubs")
@RequiredArgsConstructor
public class UserSubscriptionController {

    private final UserSubscriptionService userSubscriptionService;

    @GetMapping("/status")
    public ResponseEntity<ApiResponseDTO<UserSubscriptionDTO>> checkSubscriptionStatus(
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        UserSubscriptionDTO data = userSubscriptionService.getSubscriptionDetails(userId);
        return ResponseEntity.ok(ApiResponseDTO.success("Data status langganan berhasil ditarik!", data));
    }
}
