package com.tebudi.TeBuDi.controller;

import com.tebudi.TeBuDi.dto.ApiResponseDTO;
import com.tebudi.TeBuDi.dto.SubscriptionPlanRequestDTO;
import com.tebudi.TeBuDi.dto.SubscriptionPlanResponseDTO;
import com.tebudi.TeBuDi.model.SubscriptionPlan;
import com.tebudi.TeBuDi.service.SubscriptionPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class SubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<SubscriptionPlan>>> getAllPlans() {
        List<SubscriptionPlan> response = subscriptionPlanService.getAllPlans();
        return ResponseEntity.ok(ApiResponseDTO.success("Berhasil mengambil semua data plan.", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDTO<SubscriptionPlanResponseDTO>> createPlan(@Valid @RequestBody SubscriptionPlanRequestDTO request) {
        SubscriptionPlanResponseDTO createdPlan = subscriptionPlanService.createPlan(request);
        return ResponseEntity.ok(ApiResponseDTO.success("Plan berhasil ditambahkan.", createdPlan));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<SubscriptionPlanResponseDTO>> updatePlan(@PathVariable Integer id, @Valid @RequestBody SubscriptionPlanRequestDTO request) {
        SubscriptionPlanResponseDTO updatedPlan = subscriptionPlanService.updatePlan(id, request);
        return ResponseEntity.ok(ApiResponseDTO.success("Plan berhasil diperbarui.", updatedPlan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Void>> deletePlan(@PathVariable Integer id) {
        subscriptionPlanService.deletePlan(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Plan berhasil dihapus.", null));
    }
}
