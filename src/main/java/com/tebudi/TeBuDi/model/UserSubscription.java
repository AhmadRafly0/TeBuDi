package com.tebudi.TeBuDi.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="user_subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(
        name="user_subscription_id",
        nullable=false
    )
    private String id;

    @OneToOne()
    @JoinColumn(name="user_id")
    @JsonIgnore
    private User user;


    @Column(
        name="start_date",
        nullable=false
    )
    private LocalDateTime startDate;

    @Column(
        name="end_date",
        nullable=false
    )
    private LocalDateTime endDate;

    @Column(
        nullable=false
    )
    private boolean status = true;
}
