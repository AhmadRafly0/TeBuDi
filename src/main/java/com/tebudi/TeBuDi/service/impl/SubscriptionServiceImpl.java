package com.tebudi.TeBuDi.service.impl;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tebudi.TeBuDi.dto.CheckoutResponseDTO;
import com.tebudi.TeBuDi.dto.PaymentCallbackResponseDTO;
import com.tebudi.TeBuDi.model.SubscriptionPlan;
import com.tebudi.TeBuDi.model.Transaction;
import com.tebudi.TeBuDi.model.User;
import com.tebudi.TeBuDi.model.UserSubscription;
import com.tebudi.TeBuDi.repository.SubscriptionPlanRepository;
import com.tebudi.TeBuDi.repository.TransactionRepository;
import com.tebudi.TeBuDi.repository.UserRepository;
import com.tebudi.TeBuDi.repository.UserSubscriptionRepository;
import com.tebudi.TeBuDi.service.SubscriptionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final TransactionRepository transactionRepository;
    private final SubscriptionPlanRepository planRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final UserRepository userRepository; 

    @Override
    @Transactional
    public CheckoutResponseDTO  createPendingTransaction(String userId, Integer planId) {
        if (userSubscriptionRepository.hasActiveSubscription(userId, LocalDateTime.now())) {
            throw new RuntimeException("User sudah punya paket langganan aktif. Tidak bisa membeli yang baru.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
        
        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Paket langganan tidak ditemukan"));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setPlan(plan);
        transaction.setAmount(plan.getPrice());
        transaction.setStatus(Transaction.TransactionStatus.PENDING);

        Transaction saved =  transactionRepository.save(transaction);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public PaymentCallbackResponseDTO processSuccessfulPayment(String transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan"));

        if (transaction.getStatus() == Transaction.TransactionStatus.SUCCESS) {
            throw new RuntimeException("Transaksi ini sudah diproses sebelumnya.");
        }

        transaction.setStatus(Transaction.TransactionStatus.SUCCESS);
        transactionRepository.save(transaction);

        User user = transaction.getUser();
        Integer durationDays = transaction.getPlan().getDurationDays();
        LocalDateTime now = LocalDateTime.now();

        Optional<UserSubscription> existingSub = userSubscriptionRepository.findByUserId(user.getId());

        if (existingSub.isPresent()) {
            UserSubscription sub = existingSub.get();
            sub.setStartDate(now);
            sub.setEndDate(now.plusDays(durationDays));
            sub.setStatus(true);
            UserSubscription saved = userSubscriptionRepository.save(sub);
            return toSubscriptionResponse(saved);
        }

        UserSubscription newSub = new UserSubscription();
        newSub.setUser(user);
        newSub.setStartDate(now);
        newSub.setEndDate(now.plusDays(durationDays));
        newSub.setStatus(true);

        UserSubscription saved = userSubscriptionRepository.save(newSub);
        return toSubscriptionResponse(saved);
    }

    private CheckoutResponseDTO toResponse(Transaction transaction) {
    return CheckoutResponseDTO.builder()
            .transactionId(transaction.getTransactionId())
            .planName(transaction.getPlan().getPlanName())
            .amount(transaction.getAmount())
            .status(transaction.getStatus().name())
            .paymentDate(transaction.getPaymentDate())
            .build();
    }

    private PaymentCallbackResponseDTO toSubscriptionResponse(UserSubscription sub) {
    return PaymentCallbackResponseDTO.builder()
            .subscriptionId(sub.getId())
            .startDate(sub.getStartDate())
            .endDate(sub.getEndDate())
            .isActive(sub.isStatus())
            .build();
}
}