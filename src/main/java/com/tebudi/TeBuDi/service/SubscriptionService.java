package com.tebudi.TeBuDi.service;

import com.tebudi.TeBuDi.model.Transaction;
import java.util.UUID;

public interface SubscriptionService {
    Transaction createPendingTransaction(String userId, Integer planId);
    void processSuccessfulPayment(UUID transactionId);
}
