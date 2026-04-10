package com.tebudi.TeBuDi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.tebudi.TeBuDi.dto.ApiResponseDTO;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponseDTO<?>> handleValidationError(MethodArgumentNotValidException ex){
        String message = ex.getBindingResult().getFieldErrors().stream().map(FieldError::getDefaultMessage).findFirst().orElse("Validasi gagal");
        return ResponseEntity.badRequest().body(ApiResponseDTO.error(message));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponseDTO<?>> handleRunTimeException(RuntimeException ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponseDTO.error(ex.getMessage()));
    }

    public ResponseEntity<ApiResponseDTO<?>> handleException(Exception ex){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponseDTO.error(ex.getMessage()));
    }
}
