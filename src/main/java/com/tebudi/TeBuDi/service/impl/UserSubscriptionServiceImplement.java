package com.tebudi.TeBuDi.service.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tebudi.TeBuDi.dto.UserSubscriptionDTO;
import com.tebudi.TeBuDi.model.UserSubscription;
import com.tebudi.TeBuDi.repository.UserSubscriptionRepository;
import com.tebudi.TeBuDi.service.UserSubscriptionService;


@Service
public class UserSubscriptionServiceImplement implements UserSubscriptionService{

    @Autowired
    public UserSubscriptionRepository userSubscriptionRepository;

    @Override
    public boolean isUserSubscribed(String userId){
        return userSubscriptionRepository.hasActiveSubscription(userId, LocalDateTime.now());
    }

    @Override
    public UserSubscriptionDTO getSubscriptionDetails(String userId) {
        UserSubscription sub = userSubscriptionRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Data langganan tidak ditemukan untuk user ini"));

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
}
