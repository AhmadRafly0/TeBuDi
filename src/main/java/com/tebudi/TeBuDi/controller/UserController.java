package com.tebudi.TeBuDi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tebudi.TeBuDi.dto.UserRegisterDTO;
import com.tebudi.TeBuDi.dto.UserResponseDTO;
import com.tebudi.TeBuDi.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;




@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getProfile(@PathVariable String id) {
        return ResponseEntity.ok(userService.getProfile(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateProfile(@PathVariable String id, @Valid @RequestBody UserRegisterDTO request) {
        return ResponseEntity.ok(userService.updateProfile(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id){
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    
}
