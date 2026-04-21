package com.tebudi.TeBuDi.dto;

import lombok.Data;
import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class SubscriptionPlanRequestDTO {
    @NotBlank(message = "Nama plan harus diisi")
    private String planName;

    @NotNull(message = "Harga plan harus diisi")
    private BigDecimal price;

    @NotNull(message = "Durasi plan harus diisi")
    private Integer durationDays;

    @NotNull(message = "Ketersediaan iklan harus diisi")
    private Boolean hasAds;
}