package com.tebudi.TeBuDi.service.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
