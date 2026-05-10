package com.tebudi.TeBuDi.service;

import java.util.List;

import com.tebudi.TeBuDi.dto.CategoryResponseDTO;

public interface CategoryService {
    List<CategoryResponseDTO> getAllCategories();
}