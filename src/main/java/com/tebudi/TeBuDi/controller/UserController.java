package com.tebudi.TeBuDi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tebudi.TeBuDi.dto.ApiResponseDTO;
import com.tebudi.TeBuDi.dto.UserResponseDTO;
import com.tebudi.TeBuDi.dto.UserUpdateDTO;
import com.tebudi.TeBuDi.service.UserService;

import com.tebudi.TeBuDi.dto.UserSubscriptionDTO;
import com.tebudi.TeBuDi.service.UserSubscriptionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;




@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserSubscriptionService userSubscriptionService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> getProfile(@PathVariable String id) {
        UserResponseDTO data = userService.getProfile(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Data user berhasil di ambil!", data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> updateProfile(@PathVariable String id, @Valid @RequestBody UserUpdateDTO request) {
        UserResponseDTO data = userService.updateProfile(id, request);
        return ResponseEntity.ok(ApiResponseDTO.success("Data user berhasil diupdate!", data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Void>> deleteUser(@PathVariable String id){
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Data user berhasil dihapus", null));
    }

    @GetMapping("/{id}/usersubscription")
    public ResponseEntity<ApiResponseDTO<UserSubscriptionDTO>> getUserSubscription(@PathVariable String id) {
        UserSubscriptionDTO data = userSubscriptionService.getSubscriptionDetails(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Data langganan berhasil diambil!", data));
    }

}
