package com.tebudi.TeBuDi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutRequestDTO {
    @NotBlank(message = "userId tidak boleh kosong")
    private String userId;

    @NotNull(message = "planId tidak boleh kosong")
    private Integer planId;
}