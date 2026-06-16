package org.platforma.onlineshop.service;

import java.util.List;
import org.modelmapper.ModelMapper;
import org.platforma.onlineshop.exceptions.APIException;
import org.platforma.onlineshop.exceptions.ResourceNotFoundException;
import org.platforma.onlineshop.model.Category;
import org.platforma.onlineshop.payload.CategoryDTO;
import org.platforma.onlineshop.payload.CategoryResponse;
import org.platforma.onlineshop.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl implements CategoryService {

  @Autowired private CategoryRepository categoryRepository;

  @Autowired ModelMapper modelMapper;

  @Override
  public CategoryResponse getAllCategories(
      Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
    Sort sortByAndOrder =
        sortOrder.equalsIgnoreCase("asc")
            ? Sort.by(Sort.Direction.ASC, sortBy)
            : Sort.by(Sort.Direction.DESC, sortBy);
    Pageable pageable = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
    Page<Category> categoryPage = categoryRepository.findAll(pageable);

    List<Category> categories = categoryPage.getContent();
    if (categories.isEmpty()) {
      throw new APIException("No categories found");
    }
    List<CategoryDTO> categoryDTOS =
        categories.stream().map(category -> modelMapper.map(category, CategoryDTO.class)).toList();

    CategoryResponse categoryResponse = new CategoryResponse();
    categoryResponse.setContent(categoryDTOS);
    categoryResponse.setPageNumber(categoryPage.getNumber());
    categoryResponse.setPageSize(categoryPage.getSize());
    categoryResponse.setTotalItems((int) categoryPage.getTotalElements());
    categoryResponse.setTotalPages(categoryPage.getTotalPages());
    categoryResponse.setLastPage(categoryPage.isLast());

    return categoryResponse;
  }

  @Override
  public CategoryDTO createCategory(CategoryDTO categoryDTO) {
    Category category = modelMapper.map(categoryDTO, Category.class);
    Category categoryDB = categoryRepository.findByCategoryName(category.getCategoryName());
    if (categoryDB != null) {
      throw new APIException(
          "Categroy with the name " + category.getCategoryName() + " already exists");
    }
    Category savedCategory = categoryRepository.save(category);
    CategoryDTO savedCategoryDTO = modelMapper.map(savedCategory, CategoryDTO.class);
    return savedCategoryDTO;
  }

  @Override
  public CategoryDTO deleteCategory(long categoryId) {
    Category categoryIdToDelete =
        categoryRepository
            .findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

    categoryRepository.delete(categoryIdToDelete);
    return modelMapper.map(categoryIdToDelete, CategoryDTO.class);
  }

  @Override
  public CategoryDTO updateCategory(CategoryDTO categoryDTO, long categoryId) {
    Category savedCategory =
        categoryRepository
            .findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

    Category category = modelMapper.map(categoryDTO, Category.class);
    category.setCategoryId(categoryId);
    savedCategory = categoryRepository.save(category);
    CategoryDTO savedCategoryDTO = modelMapper.map(savedCategory, CategoryDTO.class);
    return savedCategoryDTO;
  }
}
