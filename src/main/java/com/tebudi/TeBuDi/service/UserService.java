package com.tebudi.TeBuDi.service;

import org.springframework.stereotype.Service;

import com.tebudi.TeBuDi.dto.UserLoginDTO;
import com.tebudi.TeBuDi.dto.UserRegisterDTO;
import com.tebudi.TeBuDi.dto.UserResponseDTO;
import com.tebudi.TeBuDi.dto.UserUpdateDTO;

import jakarta.servlet.http.HttpServletRequest;

@Service
public interface UserService {

    UserResponseDTO register(UserRegisterDTO request);
    UserResponseDTO login(UserLoginDTO request);
    void logout(HttpServletRequest request);
    UserResponseDTO getProfile(String id);
    UserResponseDTO updateProfile(String id, UserUpdateDTO request);
    void deleteUser(String id);
}
