package com.tebudi.TeBuDi.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutRequestDTO {
    @NotNull(message = "planId tidak boleh kosong")
    private Integer planId;
}