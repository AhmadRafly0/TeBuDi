package com.tebudi.TeBuDi.repository;

import com.tebudi.TeBuDi.model.SubscriptionPlans;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionPlansRepository extends JpaRepository<SubscriptionPlans, Integer> {
    
}
