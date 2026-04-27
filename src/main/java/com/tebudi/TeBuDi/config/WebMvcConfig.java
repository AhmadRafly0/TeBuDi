package com.tebudi.TeBuDi.config;

import java.io.File;
import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Lokasi folder relatif terhadap project root
        String uploadDir = Paths.get(System.getProperty("user.dir"))
                .resolve("data-storage")
                .toAbsolutePath()
                .toString();

        // URL /files/books/namafile.pdf → data-storage/books/namafile.pdf
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:" + uploadDir + File.separator);
    }
}