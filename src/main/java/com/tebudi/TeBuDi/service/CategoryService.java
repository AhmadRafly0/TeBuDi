package com.tebudi.TeBuDi.service;

import com.tebudi.TeBuDi.dto.CategoryResponseDTO;
import java.util.List;

public interface CategoryService {
    List<CategoryResponseDTO> getAllCategories();
}