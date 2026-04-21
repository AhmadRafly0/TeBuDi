package com.tebudi.TeBuDi.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SubscriptionPlanResponseDTO {
    private Integer planId;
    private String planName;
    private BigDecimal price;
    private Integer durationDays;
    private Boolean hasAds;
}
