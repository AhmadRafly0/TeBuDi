package com.tebudi.TeBuDi.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tebudi.TeBuDi.model.UserSubscription;
import java.util.Optional;


public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, String>{

    @Query(
        "SELECT COUNT(s) > 0 FROM UserSubscription s WHERE s.user.id = :userId AND s.status = true AND s.endDate > :now"
    )
    boolean hasActiveSubscription(@Param("userId") String userId, @Param("now") LocalDateTime now);

    Optional<UserSubscription> findById(String userId);

    Optional<UserSubscription> findByUserId(String userId);
}
