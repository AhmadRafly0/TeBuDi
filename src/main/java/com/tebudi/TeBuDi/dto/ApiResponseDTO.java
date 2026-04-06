package com.tebudi.TeBuDi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponseDTO<T>{

    private boolean success;
    private String message;
    private T data;

    public static <T> ApiResponseDTO<T> success(String message, T data){
        return new ApiResponseDTO<>(true, message, data);
    }

    public static <T> ApiResponseDTO<T> error(String message){
        return new ApiResponseDTO<>(false, message, null);
    }

}
