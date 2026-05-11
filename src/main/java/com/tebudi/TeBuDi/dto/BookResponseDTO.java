package com.tebudi.TeBuDi.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookResponseDTO {

    private String id;
    private Integer categoryId;
    private String categoryName;
    private String title;
    private String author;
    private String description;
    private String coverURL;
    private String fileURL;
    private Boolean isPremium;

}