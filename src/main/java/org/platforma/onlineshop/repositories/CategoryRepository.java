package org.platforma.onlineshop.repositories;

import org.platforma.onlineshop.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

  Category findByCategoryName(String categoryName);
}
