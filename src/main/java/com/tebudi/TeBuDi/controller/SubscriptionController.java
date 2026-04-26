package com.tebudi.TeBuDi.controller;

import com.tebudi.TeBuDi.dto.ApiResponseDTO;
import com.tebudi.TeBuDi.dto.CheckoutRequestDTO;
import com.tebudi.TeBuDi.dto.PaymentCallbackRequestDTO;
import com.tebudi.TeBuDi.dto.CheckoutResponseDTO;
import com.tebudi.TeBuDi.dto.PaymentCallbackResponseDTO;
import com.tebudi.TeBuDi.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@Valid @RequestBody CheckoutRequestDTO request) {
        CheckoutResponseDTO response = subscriptionService.createPendingTransaction(
                request.getUserId(), 
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