package com.tebudi.TeBuDi.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tebudi.TeBuDi.dto.ApiResponseDTO;
import com.tebudi.TeBuDi.dto.CategoryResponseDTO;
import com.tebudi.TeBuDi.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<CategoryResponseDTO>>> getAllCategories() {
        List<CategoryResponseDTO> data = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponseDTO.success("Daftar kategori berhasil ditarik!", data));
    }
}