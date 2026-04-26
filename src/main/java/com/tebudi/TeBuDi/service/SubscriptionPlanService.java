package com.tebudi.TeBuDi.service;

import com.tebudi.TeBuDi.dto.SubscriptionPlanRequestDTO;
import com.tebudi.TeBuDi.dto.SubscriptionPlanResponseDTO;
import com.tebudi.TeBuDi.model.SubscriptionPlan;
import java.util.List;

public interface SubscriptionPlanService {
    List<SubscriptionPlan> getAllPlans();
    SubscriptionPlanResponseDTO createPlan(SubscriptionPlanRequestDTO request);
    SubscriptionPlanResponseDTO updatePlan(Integer id, SubscriptionPlanRequestDTO request);
    void deletePlan(Integer id);
}
