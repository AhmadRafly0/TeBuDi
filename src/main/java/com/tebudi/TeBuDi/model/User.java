package com.tebudi.TeBuDi.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    public enum userRole{
        member,
        admin
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(
        name="user_id", 
        nullable=false
    )
    private String id;

    @Column(
        name="name", 
        nullable=false
    )
    private String username;

    @Column(
        nullable=false, 
        unique=true
    )
    private String email;

    @Column(nullable=false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(
        nullable=false, 
        insertable = false
    )
    private userRole role = userRole.member;

    @Column(name="avatar_url")
    private String avatarURL;

    @CreationTimestamp
    @Column(
        name="created_at",
        nullable = false, 
        updatable = false
    )
    private LocalDateTime createdAt;


}
