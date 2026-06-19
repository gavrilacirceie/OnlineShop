package org.platforma.onlineshop.service;

import java.io.IOException;
import java.util.List;
import org.jspecify.annotations.NonNull;
import org.modelmapper.ModelMapper;
import org.platforma.onlineshop.exceptions.APIException;
import org.platforma.onlineshop.exceptions.ResourceNotFoundException;
import org.platforma.onlineshop.model.Cart;
import org.platforma.onlineshop.model.Category;
import org.platforma.onlineshop.model.Product;
import org.platforma.onlineshop.payload.CartDTO;
import org.platforma.onlineshop.payload.ProductDTO;
import org.platforma.onlineshop.payload.ProductResponse;
import org.platforma.onlineshop.repositories.CartRepository;
import org.platforma.onlineshop.repositories.CategoryRepository;
import org.platforma.onlineshop.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProductServiceImpl implements ProductService {

  @Autowired private ProductRepository productRepository;

  @Autowired private CategoryRepository categoryRepository;

  @Autowired private ModelMapper modelMapper;

  @Autowired private FileService fileService;

  @Value("${project.image.path}")
  private String imagePath;

  @Value("${image.base.url}")
  private String imageBaseUrl;

  @Autowired private CartRepository cartRepository;
  @Autowired private CartService cartService;

  public ProductServiceImpl(CategoryRepository categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  @Override
  public ProductDTO createProduct(Long categoryId, ProductDTO productDTO) {
    boolean isProductNotFound = true;
    Product product = modelMapper.map(productDTO, Product.class);
    Category category =
        categoryRepository
            .findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));
    List<Product> products = category.getProducts();

    for (Product value : products) {
      if (value.getProductName().equals(productDTO.getProductName())) {
        isProductNotFound = false;
        break;
      }
    }
    if (isProductNotFound) {
      product.setCategory(category);
      product.setImage("default.png");
      double specialPrice =
          product.getProductPrice()
              - (product.getDiscountPrice() * 0.01) * product.getProductPrice();
      product.setSpecialPrice(specialPrice);
      Product savedProduct = productRepository.save(product);
      return modelMapper.map(savedProduct, ProductDTO.class);
    } else {
      throw new APIException("Product already exists");
    }
  }

  @Override
  public ProductResponse getAllProducts(
          Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String keyword, String category) {
    Sort sort =
        sortOrder.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();
    Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

    Specification<Product> spec = null;

    if (keyword != null && !keyword.isEmpty()) {
      Specification<Product> keywordSpec = (root, query, cb) ->
          cb.like(cb.lower(root.get("productName")), "%" + keyword.toLowerCase() + "%");
      spec = keywordSpec;
    }

    if (category != null && !category.isEmpty()) {
      Specification<Product> categorySpec = (root, query, cb) ->
          cb.equal(cb.lower(root.get("category").get("categoryName")), category.toLowerCase());
      spec = (spec == null) ? categorySpec : spec.and(categorySpec);
    }

    Page<Product> productPage;
    if (spec != null) {
      productPage = productRepository.findAll(spec, pageable);
    } else {
      productPage = productRepository.findAll(pageable);
    }

    List<Product> allProducts = productPage.getContent();

    return getProductResponse(allProducts, productPage);
  }

  private String constructImageUrl(String imageName){
    return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageName : imageBaseUrl + "/" + imageName;
  }

  @NonNull
  private ProductResponse getProductResponse(List<Product> allProducts, Page<Product> productPage) {
    List<ProductDTO> productDTOS =
        allProducts.stream().map(product -> {
          ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
          productDTO.setImage(constructImageUrl(productDTO.getImage()));
          return productDTO;
        }).toList();
    ProductResponse productResponse = new ProductResponse();
    productResponse.setContent(productDTOS);
    productResponse.setPageNumber(productPage.getNumber());
    productResponse.setPageSize(productPage.getSize());
    productResponse.setTotalItems((int) productPage.getTotalElements());
    productResponse.setTotalPages(productPage.getTotalPages());
    productResponse.setLastPage(productPage.isLast());
    return productResponse;
  }

  @Override
  public ProductResponse getAllProductsByCategoryId(
      Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
    Sort sort =
        sortOrder.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();
    Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
    Category category =
        categoryRepository
            .findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

    Page<Product> productPage =
        productRepository.findByCategoryOrderByProductPriceAsc(category, pageable);
    List<Product> allProducts = productPage.getContent();

    return getProductResponse(allProducts, productPage);
  }

  @Override
  public ProductResponse getProductsByKeyword(
      String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
    Sort sort =
        sortOrder.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();
    Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
    Page<Product> productPage =
        productRepository.findByProductNameLikeIgnoreCase('%' + keyword + '%', pageable);
    List<Product> allProducts = productPage.getContent();
    if (allProducts.isEmpty()) throw new APIException("No products found for keyword: " + keyword);

    return getProductResponse(allProducts, productPage);
  }

  @Override
  public ProductDTO updateProduct(ProductDTO productDTO, Long productId) {
    Product product = modelMapper.map(productDTO, Product.class);
    Product savedProduct =
        productRepository
            .findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", productId));

    savedProduct.setProductName(product.getProductName());
    savedProduct.setProductDescription(product.getProductDescription());
    savedProduct.setQuantity(product.getQuantity());
    savedProduct.setDiscountPrice(product.getDiscountPrice());
    savedProduct.setProductPrice(product.getProductPrice());
    savedProduct.setSpecialPrice(product.getSpecialPrice());

    Product saveProduct = productRepository.save(savedProduct);

    List<Cart> carts = cartRepository.findCartsByProductId(productId);

    List<CartDTO> cartDTOS =
        carts.stream()
            .map(
                cart -> {
                  CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
                  List<ProductDTO> productDTOS =
                      cart.getCartItems().stream()
                          .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class))
                          .toList();
                  cartDTO.setProducts(productDTOS);
                  return cartDTO;
                })
            .toList();

    cartDTOS.forEach(cart -> cartService.updateProductInCarts(cart.getCartId(), productId));

    return modelMapper.map(saveProduct, ProductDTO.class);
  }

  @Override
  public ProductDTO deleteProduct(Long productId) {
    Product productIdToDelete =
        productRepository
            .findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

    List<Cart> carts = cartRepository.findCartsByProductId(productId);
    carts.forEach(cart -> cartService.deleteProductFromCart(cart.getCartId(), productId));
    productRepository.delete(productIdToDelete);
    return modelMapper.map(productIdToDelete, ProductDTO.class);
  }

  @Override
  public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {
    Product productFromDb =
        productRepository
            .findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

    String filename = fileService.uploadImage(imagePath, image);
    productFromDb.setImage(filename);
    Product savedProduct = productRepository.save(productFromDb);

    return modelMapper.map(savedProduct, ProductDTO.class);
  }
}
