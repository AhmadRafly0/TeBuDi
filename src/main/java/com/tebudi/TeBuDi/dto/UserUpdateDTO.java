package com.tebudi.TeBuDi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateDTO {

    @Size(min = 4, max = 20, message = "Username harus antara 4-20 karakter")
    private String username;

    @Email(message = "Format email harus benar")
    private String email;

    @Size(min = 8, message = "Password minimal 8 karakter")
    private String password;
}
