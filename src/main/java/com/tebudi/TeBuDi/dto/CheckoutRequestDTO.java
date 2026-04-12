package com.tebudi.TeBuDi.dto;

import lombok.Data;

@Data
public class CheckoutRequestDTO {
    private String userId; 
    private Integer planId;
}