package com.tebudi.TeBuDi.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentCallbackRequestDTO {
    @NotBlank(message = "transactionId tidak boleh kosong")
    private String transactionId;
}