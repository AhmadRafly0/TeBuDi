package com.tebudi.TeBuDi.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BookUpdateDTO {

    private MultipartFile bookFile; 

    private Integer category;

    @Size(min = 1, max = 255, message = "Judul maksimal 255 karakter")
    private String title;

    @Size(min = 1, max = 100, message = "Penulis maksimal 100 karakter")
    private String author;

    private String description;

    private String coverURL;

    private Boolean isPremium;
}