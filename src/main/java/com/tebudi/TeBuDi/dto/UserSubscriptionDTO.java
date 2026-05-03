package com.tebudi.TeBuDi.dto;

import java.time.LocalDateTime;


import lombok.Data;

@Data
public class UserSubscriptionDTO {
    private String id;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean status;
    private boolean isActive;
}