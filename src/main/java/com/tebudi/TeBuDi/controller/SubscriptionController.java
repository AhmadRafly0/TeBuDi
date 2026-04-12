package com.tebudi.TeBuDi.controller;

import com.tebudi.TeBuDi.dto.CheckoutRequestDTO;
import com.tebudi.TeBuDi.dto.PaymentCallbackRequestDTO;
import com.tebudi.TeBuDi.dto.TransactionResponseDTO;
import com.tebudi.TeBuDi.model.Transaction;
import com.tebudi.TeBuDi.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequestDTO request) {
        try {
            Transaction transaction = subscriptionService.createPendingTransaction(
                    request.getUserId(), 
                    request.getPlanId()
            );

            TransactionResponseDTO response = TransactionResponseDTO.builder()
                    .transactionId(transaction.getTransactionId())
                    .planName(transaction.getPlan().getPlanName())
                    .amount(transaction.getAmount())
                    .status(transaction.getStatus().name())
                    .paymentDate(transaction.getPaymentDate())
                    .build();

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/payment-callback")
    public ResponseEntity<?> handlePaymentSuccess(@RequestBody PaymentCallbackRequestDTO request) {
        try {
            subscriptionService.processSuccessfulPayment(request.getTransactionId());
            return ResponseEntity.ok("Pembayaran telah diproses dan langganan berhasil diaktifkan.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}