package com.tebudi.TeBuDi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tebudi.TeBuDi.dto.ApiResponseDTO;
import com.tebudi.TeBuDi.dto.UserLoginDTO;
import com.tebudi.TeBuDi.dto.UserRegisterDTO;
import com.tebudi.TeBuDi.dto.UserResponseDTO;
import com.tebudi.TeBuDi.security.JwtUtil;
import com.tebudi.TeBuDi.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> register(
            @Valid @RequestBody UserRegisterDTO request) {
        UserResponseDTO data = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDTO.success("Register berhasil!", data));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> login(
            @Valid @RequestBody UserLoginDTO request) {
        UserResponseDTO data = userService.login(request);

        // Generate JWT dan sisipkan ke response
        String token = jwtUtil.generateToken(data.getId(), data.getRole());
        data.setToken(token);

        return ResponseEntity.ok(ApiResponseDTO.success("Login berhasil!", data));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> getCurrentUser(
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponseDTO<>(false, "Token tidak valid atau sudah expired", null));
        }

        String userId = (String) authentication.getPrincipal();
        UserResponseDTO data = userService.getProfile(userId);
        return ResponseEntity.ok(ApiResponseDTO.success("Profil ditemukan!", data));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponseDTO<Void>> logout() {
        // JWT stateless — logout cukup hapus token di sisi frontend
        return ResponseEntity.ok(ApiResponseDTO.success("Logout berhasil!", null));
    }
}
