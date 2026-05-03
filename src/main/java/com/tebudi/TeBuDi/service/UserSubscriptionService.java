package com.tebudi.TeBuDi.service;

import org.springframework.stereotype.Service;
import com.tebudi.TeBuDi.dto.UserSubscriptionDTO;

@Service
public interface UserSubscriptionService {

    public boolean isUserSubscribed(String userId);
    public UserSubscriptionDTO getSubscriptionDetails(String userId);
}
