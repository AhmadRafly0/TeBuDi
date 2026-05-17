package com.tebudi.TeBuDi.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.url}")
    private String cloudinaryUrl;

    @Bean
    public Cloudinary cloudinary() {
        // Menggunakan konstruktor String URL secara langsung.
        // Cara ini secara otomatis mem-parsing kredensial dengan aman & kompatibel di Spring Boot 4.x
        return new Cloudinary(cloudinaryUrl);
    }
}