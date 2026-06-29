package org.platforma.onlineshop.service;

import java.io.IOException;
import org.platforma.onlineshop.payload.ProductDTO;
import org.platforma.onlineshop.payload.ProductResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ProductService {
  ProductDTO createProduct(Long categoryId, ProductDTO product);

  ProductResponse getAllProducts(
      Integer pageNumber,
      Integer pageSize,
      String sortBy,
      String sortOrder,
      String keyword,
      String category);

  ProductResponse getAllProductsByCategoryId(
      Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

  ProductResponse getProductsByKeyword(
      String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

  ProductDTO updateProduct(ProductDTO productDTO, Long productId);

  ProductDTO deleteProduct(Long productId);

  ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException;

  ProductDTO createSellerProduct(Long sellerId, Long categoryId, ProductDTO product);

  ProductResponse getSellerProducts(
      Long sellerId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder,
      String keyword);

  ProductDTO updateSellerProduct(Long sellerId, Long productId, ProductDTO productDTO);

  ProductDTO deleteSellerProduct(Long sellerId, Long productId);

  ProductDTO updateSellerProductImage(Long sellerId, Long productId, MultipartFile image)
      throws IOException;
}
