package com.tebudi.TeBuDi.service;

import com.tebudi.TeBuDi.model.Transaction;

public interface SubscriptionService {
    Transaction createPendingTransaction(String userId, Integer planId);
    void processSuccessfulPayment(String transactionId);
}
