package com.tebudi.TeBuDi.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.tebudi.TeBuDi.dto.UserLoginDTO;
import com.tebudi.TeBuDi.dto.UserRegisterDTO;
import com.tebudi.TeBuDi.dto.UserResponseDTO;
import com.tebudi.TeBuDi.dto.UserUpdateDTO;
import com.tebudi.TeBuDi.model.User;
import com.tebudi.TeBuDi.model.UserSubscription;
import com.tebudi.TeBuDi.repository.UserRepository;
import com.tebudi.TeBuDi.repository.UserSubscriptionRepository;
import com.tebudi.TeBuDi.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImplement implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserSubscriptionRepository userSubscriptionRepository;

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
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);

        UserSubscription subscription = new UserSubscription();
        subscription.setUser(saved);
        
        LocalDateTime now = LocalDateTime.now();
        subscription.setStartDate(now);
        subscription.setEndDate(now);
        subscription.setStatus(false);

        userSubscriptionRepository.save(subscription);

        return toResponse(saved);
    }

    @Override
    public UserResponseDTO login(UserLoginDTO request){
        User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Email tidak ditemukan!"));
        
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
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
    public UserResponseDTO updateProfile(String id, UserUpdateDTO request){
        User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User tidak ditemukan!"));
                    
        if(StringUtils.hasText(request.getUsername()))  user.setUsername(request.getUsername());
        if(StringUtils.hasText(request.getEmail()))     user.setEmail(request.getEmail());
        if(StringUtils.hasText(request.getPassword()))  user.setPassword(passwordEncoder.encode(request.getPassword()));

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
