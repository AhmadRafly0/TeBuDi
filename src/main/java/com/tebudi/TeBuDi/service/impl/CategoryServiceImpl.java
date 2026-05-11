package com.tebudi.TeBuDi.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tebudi.TeBuDi.dto.CategoryResponseDTO;
import com.tebudi.TeBuDi.repository.CategoryRepository;
import com.tebudi.TeBuDi.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAll().stream().map(category -> {
            CategoryResponseDTO dto = new CategoryResponseDTO();
            dto.setIdCategory(category.getId());
            dto.setNameCategory(category.getName());
            
            return dto;
        }).collect(Collectors.toList());
    }
}