package com.tebudi.TeBuDi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    public enum TransactionStatus {
        PENDING,
        SUCCESS,
        FAILED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(
        name = "transaction_id", 
        updatable = false, 
        nullable = false
    )
    private String transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "user_id", 
        nullable = false
    )
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(    
        name = "plan_id", 
        nullable = false
    )
    private SubscriptionPlan plan;

    @Column(
        nullable = false, 
        precision = 12, 
        scale = 2
    )
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(
        nullable = false
    )
    private TransactionStatus status;

    @CreationTimestamp
    @Column(
        name = "payment_date", 
        updatable = false
    )
    private LocalDateTime paymentDate;
}
