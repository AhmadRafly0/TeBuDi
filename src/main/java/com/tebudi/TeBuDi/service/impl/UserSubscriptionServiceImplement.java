package com.tebudi.TeBuDi.service.impl;

import java.time.LocalDateTime;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tebudi.TeBuDi.dto.UserSubscriptionDTO;
import com.tebudi.TeBuDi.model.UserSubscription;
import com.tebudi.TeBuDi.model.User;
import com.tebudi.TeBuDi.repository.UserRepository;
import com.tebudi.TeBuDi.repository.UserSubscriptionRepository;
import com.tebudi.TeBuDi.service.UserSubscriptionService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class UserSubscriptionServiceImplement implements UserSubscriptionService{
    
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final UserRepository userRepository;

    @Override
    public boolean isUserSubscribed(String userId){
        return userSubscriptionRepository.hasActiveSubscription(userId, LocalDateTime.now());
    }

    @Override
    public UserSubscriptionDTO getSubscriptionDetails(String userId) {
        UserSubscription sub = userSubscriptionRepository.findByUserId(userId)
            .orElseGet(() -> createDefaultSubscription(userId));

        UserSubscriptionDTO dto = new UserSubscriptionDTO();
        dto.setId(sub.getId());
        dto.setStartDate(sub.getStartDate());
        dto.setEndDate(sub.getEndDate());
        dto.setStatus(sub.isStatus());

        //checkk expired langganan
        boolean stillActive = sub.isStatus() && sub.getEndDate().isAfter(LocalDateTime.now());
        dto.setActive(stillActive);

        return dto;
    }

    private UserSubscription createDefaultSubscription(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Data langganan tidak ditemukan untuk user ini"));
        
        UserSubscription newSubs = new UserSubscription();
        newSubs.setUser(user);
        newSubs.setStartDate(LocalDateTime.now());
        newSubs.setEndDate(LocalDateTime.now());
        newSubs.setStatus(false);

        return userSubscriptionRepository.save(newSubs);
    }
}
