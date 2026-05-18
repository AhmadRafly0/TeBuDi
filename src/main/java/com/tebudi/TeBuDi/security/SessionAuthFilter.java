// SessionAuthFilter.java — DEPRECATED, digantikan oleh JwtAuthFilter
// File ini dipertahankan untuk referensi tapi tidak aktif sebagai Spring bean
package com.tebudi.TeBuDi.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * @deprecated Digantikan oleh JwtAuthFilter. Tidak aktif sebagai Spring bean.
 */
public class SessionAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        filterChain.doFilter(request, response);
    }
}