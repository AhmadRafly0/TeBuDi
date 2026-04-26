package com.tebudi.TeBuDi.dto;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentCallbackResponseDTO {
    private String subscriptionId;
    private String planName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
}
