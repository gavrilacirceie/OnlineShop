package org.platforma.onlineshop.service;

import org.platforma.onlineshop.payload.CategoryDTO;
import org.platforma.onlineshop.payload.CategoryResponse;

public interface CategoryService {
  CategoryResponse getAllCategories(
      Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

  CategoryDTO createCategory(CategoryDTO categoryDTO);

  CategoryDTO deleteCategory(long categoryId);

  CategoryDTO updateCategory(CategoryDTO categoryDTO, long categoryId);
}
