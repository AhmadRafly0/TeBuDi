package com.tebudi.TeBuDi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tebudi.TeBuDi.dto.ApiResponseDTO;
import com.tebudi.TeBuDi.dto.UserLoginDTO;
import com.tebudi.TeBuDi.dto.UserRegisterDTO;
import com.tebudi.TeBuDi.dto.UserResponseDTO;
import com.tebudi.TeBuDi.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> register(@Valid @RequestBody UserRegisterDTO request) {
        UserResponseDTO data = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponseDTO.success("Register berhasil!", data));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> login(@Valid @RequestBody UserLoginDTO request, HttpSession session) {
        UserResponseDTO data = userService.login(request);
        session.setAttribute("USER_SESSION", data);
        return ResponseEntity.ok(ApiResponseDTO.success("Login berhasil!", data));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> getCurrentUser(HttpSession session) {
        UserResponseDTO sessionUser = (UserResponseDTO) session.getAttribute("USER_SESSION");

        if (sessionUser == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ApiResponseDTO<>(false, "Session tidak ditemukan, silakan login kembali", null));
        }

        String userId = sessionUser.getId();

        UserResponseDTO data =userService.getProfile(userId);
        return ResponseEntity.ok(ApiResponseDTO.success("Profil ditemukan!", data));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponseDTO<Void>> logout(HttpServletRequest request) {
        userService.logout(request);
        return ResponseEntity.ok(ApiResponseDTO.success("Logout berhasil!", null));
    }
    
    
    
    
}
