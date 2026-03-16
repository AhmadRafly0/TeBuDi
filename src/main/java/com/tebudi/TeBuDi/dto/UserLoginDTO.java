package com.tebudi.TeBuDi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginDTO {

    @NotBlank(message = "Email harus diisi")
    @Email(message = "Format email salah")
    private String email;

    @NotBlank(message = "Password harus diisi")
    private String password;
}
