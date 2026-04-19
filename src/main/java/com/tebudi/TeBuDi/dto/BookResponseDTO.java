package com.tebudi.TeBuDi.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookResponseDTO {

    private String id;
    private int category;
    private String title;
    private String author;
    private String description;
    private String coverURL;
    private String fileURL;
    private boolean isPremium;

}