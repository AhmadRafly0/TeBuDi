package com.tebudi.TeBuDi.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponseDTO {
    private String transactionId;
    private String planName;
    private BigDecimal amount;
    private String status;
    private LocalDateTime paymentDate;
}