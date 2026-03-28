package com.tebudi.TeBuDi.service.impl;

import org.springframework.stereotype.Service;

import com.tebudi.TeBuDi.dto.UserLoginDTO;
import com.tebudi.TeBuDi.dto.UserRegisterDTO;
import com.tebudi.TeBuDi.dto.UserResponseDTO;
import com.tebudi.TeBuDi.model.User;
import com.tebudi.TeBuDi.repository.UserRepository;
import com.tebudi.TeBuDi.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImplement implements UserService {

    private final UserRepository userRepository;


    @Override
    public UserResponseDTO register(UserRegisterDTO request){

        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email sudah terdaftar!");
        }

        if(userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("Username sudah dipakai!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    @Override
    public UserResponseDTO login(UserLoginDTO request){
        User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Email tidak ditemukan!"));
        
        if(!request.getPassword().equals(user.getPassword())){
            throw new RuntimeException("Password salah!");
        }

        return toResponse(user);
    }

    @Override
    public UserResponseDTO getProfile(String id){
        User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User tidak ditemukan!"));
        
        return toResponse(user);
    }

    @Override
    public UserResponseDTO updateProfile(String id, UserRegisterDTO request){
        User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User tidak ditemukan!"));
                    
                    
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        User updated = userRepository.save(user);

        return toResponse(updated);
    }

    @Override
    public void deleteUser(String id){
        userRepository.deleteById(id);
    }

    private UserResponseDTO toResponse(User user) {
        UserResponseDTO response = new UserResponseDTO();
        response.setId(String.valueOf(user.getId()));
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(String.valueOf(user.getRole()));
        response.setAvatarURL(user.getAvatarURL());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
    
}
