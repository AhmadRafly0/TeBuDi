package com.tebudi.TeBuDi.service;

import org.springframework.stereotype.Service;

@Service
public interface UserSubscriptionService {

    public boolean isUserSubscribed(String userId);
}
