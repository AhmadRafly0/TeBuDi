package com.tebudi.TeBuDi.service.impl;

import com.tebudi.TeBuDi.dto.CategoryResponseDTO;
import com.tebudi.TeBuDi.model.Category;
import com.tebudi.TeBuDi.repository.CategoryRepository;
import com.tebudi.TeBuDi.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponseDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        
        // Mapping manual sesuai gaya koding TeBuDi
        return categories.stream().map(cat -> {
            CategoryResponseDTO dto = new CategoryResponseDTO();
            dto.setId(cat.getId());
            dto.setName(cat.getName());
            dto.setDescription(cat.getDescription());
            return dto;
        }).collect(Collectors.toList());
    }
}