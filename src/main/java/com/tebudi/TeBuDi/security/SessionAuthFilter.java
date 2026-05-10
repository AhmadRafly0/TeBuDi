// src/main/java/com/tebudi/TeBuDi/security/SessionAuthFilter.java
package com.tebudi.TeBuDi.security;

import com.tebudi.TeBuDi.dto.UserResponseDTO;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Filter ini dijalankan sekali per request.
 * Tugasnya: baca USER_SESSION dari HttpSession, lalu set
 * Authentication ke SecurityContext supaya Spring Security tahu
 * siapa user-nya dan apa role-nya.
 *
 * Tanpa filter ini, .hasRole("ADMIN") di SecurityConfig tidak akan
 * bisa berfungsi meski session sudah ada.
 */
@Component
public class SessionAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Ambil session yang sudah ada (false = jangan buat baru)
        HttpSession session = request.getSession(false);

        if (session != null) {
            UserResponseDTO sessionUser =
                    (UserResponseDTO) session.getAttribute("USER_SESSION");

            if (sessionUser != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

                // Konversi role string ("admin" / "member") ke Spring GrantedAuthority
                // Spring Security butuh prefix "ROLE_" untuk .hasRole()
                String roleStr = sessionUser.getRole() != null
                        ? sessionUser.getRole().toUpperCase()
                        : "MEMBER";

                List<SimpleGrantedAuthority> authorities = List.of(
                        new SimpleGrantedAuthority("ROLE_" + roleStr)
                );

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                sessionUser.getId(), // principal
                                null,                // credentials (tidak perlu)
                                authorities
                        );

                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        filterChain.doFilter(request, response);
    }
}