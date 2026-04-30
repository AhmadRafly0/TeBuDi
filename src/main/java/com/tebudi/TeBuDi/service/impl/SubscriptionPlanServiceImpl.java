package com.tebudi.TeBuDi.service.impl;

import com.tebudi.TeBuDi.dto.SubscriptionPlanRequestDTO;
import com.tebudi.TeBuDi.dto.SubscriptionPlanResponseDTO;
//import com.tebudi.TeBuDi.dto.UserResponseDTO;
import com.tebudi.TeBuDi.model.SubscriptionPlan;
import com.tebudi.TeBuDi.repository.SubscriptionPlanRepository;
import com.tebudi.TeBuDi.service.SubscriptionPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {

    private final SubscriptionPlanRepository subscriptionPlanRepository;

    @Override
    public List<SubscriptionPlan> getAllPlans() {
        return subscriptionPlanRepository.findAll();
    }

    @Override
    public SubscriptionPlanResponseDTO createPlan(SubscriptionPlanRequestDTO request) {
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setPlanName(request.getPlanName());
        plan.setPrice(request.getPrice());
        plan.setDurationDays(request.getDurationDays());
        plan.setHasAds(request.getHasAds());
        
        SubscriptionPlan savedPlan = subscriptionPlanRepository.save(plan);
        return toResponse(savedPlan);
    }

    @Override
    public SubscriptionPlanResponseDTO updatePlan(Integer id, SubscriptionPlanRequestDTO request) {
        
        SubscriptionPlan existingPlan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan tidak ditemukan dengan id: " + id));

        
        existingPlan.setPlanName(request.getPlanName());
        existingPlan.setPrice(request.getPrice());
        existingPlan.setDurationDays(request.getDurationDays());
        existingPlan.setHasAds(request.getHasAds());

        SubscriptionPlan updatedPlan = subscriptionPlanRepository.save(existingPlan);
        return toResponse(updatedPlan);
    }

    @Override
    public void deletePlan(Integer id) {
        if (!subscriptionPlanRepository.existsById(id)) {
            throw new RuntimeException("Plan tidak ditemukan dengan id: " + id);
        }
        subscriptionPlanRepository.deleteById(id);
    }

    private SubscriptionPlanResponseDTO toResponse(SubscriptionPlan plan) {
        SubscriptionPlanResponseDTO response = new SubscriptionPlanResponseDTO();
        response.setPlanId(plan.getPlanId());
        response.setPlanName(plan.getPlanName());
        response.setPrice(plan.getPrice());
        response.setDurationDays(plan.getDurationDays());
        response.setHasAds(plan.getHasAds());
        return response;
    }

}
