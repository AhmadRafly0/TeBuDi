package com.tebudi.TeBuDi.service;

import com.tebudi.TeBuDi.dto.CheckoutResponseDTO;
import com.tebudi.TeBuDi.dto.PaymentCallbackResponseDTO;

public interface SubscriptionService {
    CheckoutResponseDTO createPendingTransaction(String userId, Integer planId);
    PaymentCallbackResponseDTO processSuccessfulPayment(String transactionId);
}
