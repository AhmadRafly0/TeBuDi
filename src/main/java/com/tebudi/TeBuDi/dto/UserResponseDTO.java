package com.tebudi.TeBuDi.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UserResponseDTO {
    private String id;
    private String name;
    private String email;
    private String role;
    private String avatarURL;
    private LocalDateTime createdAt;
}
