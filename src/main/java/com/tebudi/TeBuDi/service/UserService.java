package com.tebudi.TeBuDi.service;

import org.springframework.stereotype.Service;

import com.tebudi.TeBuDi.dto.UserLoginDTO;
import com.tebudi.TeBuDi.dto.UserRegisterDTO;
import com.tebudi.TeBuDi.dto.UserResponseDTO;

@Service
public interface UserService {

    UserResponseDTO register(UserRegisterDTO request);
    UserResponseDTO login(UserLoginDTO request);
    UserResponseDTO getProfile(String id);
    UserResponseDTO updateProfile(String id, UserRegisterDTO request);
    void deleteUser(String id);
}
