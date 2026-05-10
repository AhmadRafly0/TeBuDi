// src/main/java/com/tebudi/TeBuDi/controller/SubscriptionPlanController.java
package com.tebudi.TeBuDi.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tebudi.TeBuDi.dto.ApiResponseDTO;
import com.tebudi.TeBuDi.dto.SubscriptionPlanRequestDTO;
import com.tebudi.TeBuDi.dto.SubscriptionPlanResponseDTO;
import com.tebudi.TeBuDi.model.SubscriptionPlan;
import com.tebudi.TeBuDi.service.SubscriptionPlanService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class SubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    // ── Public (semua user login) ─────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<SubscriptionPlan>>> getAllPlans() {
        List<SubscriptionPlan> response = subscriptionPlanService.getAllPlans();
        return ResponseEntity.ok(ApiResponseDTO.success("Berhasil mengambil semua data plan.", response));
    }

    // ── Admin only ────────────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<SubscriptionPlanResponseDTO>> createPlan(
            @Valid @RequestBody SubscriptionPlanRequestDTO request) {
        SubscriptionPlanResponseDTO createdPlan = subscriptionPlanService.createPlan(request);
        return ResponseEntity.ok(ApiResponseDTO.success("Plan berhasil ditambahkan.", createdPlan));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<SubscriptionPlanResponseDTO>> updatePlan(
            @PathVariable Integer id,
            @Valid @RequestBody SubscriptionPlanRequestDTO request) {
        SubscriptionPlanResponseDTO updatedPlan = subscriptionPlanService.updatePlan(id, request);
        return ResponseEntity.ok(ApiResponseDTO.success("Plan berhasil diperbarui.", updatedPlan));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<Void>> deletePlan(@PathVariable Integer id) {
        subscriptionPlanService.deletePlan(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Plan berhasil dihapus.", null));
    }
}