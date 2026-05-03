package com.tebudi.TeBuDi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tebudi.TeBuDi.dto.ApiResponseDTO;
import com.tebudi.TeBuDi.dto.CheckoutRequestDTO;
import com.tebudi.TeBuDi.dto.CheckoutResponseDTO;
import com.tebudi.TeBuDi.dto.PaymentCallbackRequestDTO;
import com.tebudi.TeBuDi.dto.PaymentCallbackResponseDTO;
import com.tebudi.TeBuDi.dto.UserResponseDTO;
import com.tebudi.TeBuDi.service.SubscriptionService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@Valid @RequestBody CheckoutRequestDTO request, HttpSession session) {

        UserResponseDTO sessionUser = (UserResponseDTO) session.getAttribute("USER_SESSION");

        if (sessionUser == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ApiResponseDTO<>(false, "Session tidak ditemukan, silakan login kembali", null));
        }

        String userId = sessionUser.getId();

        CheckoutResponseDTO response = subscriptionService.createPendingTransaction(
                userId, 
                request.getPlanId()
        );
        return ResponseEntity.ok(ApiResponseDTO.success("Proses checkout berhasil.", response));
    }

    @PostMapping("/payment-callback")
    public ResponseEntity<?> handlePaymentSuccess(@Valid @RequestBody PaymentCallbackRequestDTO request) {
        PaymentCallbackResponseDTO response = subscriptionService.processSuccessfulPayment(
            request.getTransactionId()
        );
        return ResponseEntity.ok(ApiResponseDTO.success("Pembayaran berhasil dan langganan aktif.", response));
    }
} 