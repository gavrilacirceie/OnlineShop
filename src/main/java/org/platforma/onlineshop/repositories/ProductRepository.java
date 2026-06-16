package org.platforma.onlineshop.repositories;

import org.platforma.onlineshop.model.Category;
import org.platforma.onlineshop.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
  Page<Product> findByCategoryOrderByProductPriceAsc(Category category, Pageable pageable);

  Page<Product> findByProductNameLikeIgnoreCase(String keyword, Pageable pageable);
}
