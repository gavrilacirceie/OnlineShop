package org.platforma.onlineshop.service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.jspecify.annotations.NonNull;
import org.modelmapper.ModelMapper;
import org.platforma.onlineshop.exceptions.APIException;
import org.platforma.onlineshop.exceptions.ResourceNotFoundException;
import org.platforma.onlineshop.model.Cart;
import org.platforma.onlineshop.model.CartItem;
import org.platforma.onlineshop.model.Product;
import org.platforma.onlineshop.payload.CartDTO;
import org.platforma.onlineshop.payload.CartItemsDTO;
import org.platforma.onlineshop.payload.ProductDTO;
import org.platforma.onlineshop.repositories.CartItemRepository;
import org.platforma.onlineshop.repositories.CartRepository;
import org.platforma.onlineshop.repositories.ProductRepository;
import org.platforma.onlineshop.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartServiceImpl implements CartService {
  @Autowired private CartRepository cartRepository;

  @Autowired private AuthUtil authUtil;

  @Autowired ProductRepository productRepository;

  @Autowired CartItemRepository cartItemRepository;

  @Autowired ModelMapper modelMapper;

  @Value("${image.base.url}")
  private String imageBaseUrl;

  @Override
  public CartDTO addProductToCart(Long productId, Integer quantity) {
    Cart cart = createCart();

    Product product =
        productRepository
            .findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

    CartItem cartItem =
        cartItemRepository.findCartItemByProductIdAndCartId(cart.getCartId(), productId);

    if (cartItem != null) {
      throw new APIException("Product " + product.getProductName() + " already exists in the cart");
    }

    if (product.getQuantity() == 0) {
      throw new APIException(product.getProductName() + " is not available");
    }

    if (product.getQuantity() < quantity) {
      throw new APIException(
          "Please, make an order of the "
              + product.getProductName()
              + " less than or equal to the quantity "
              + product.getQuantity()
              + ".");
    }

    CartItem newCartItem = new CartItem();

    newCartItem.setProduct(product);
    newCartItem.setCart(cart);
    newCartItem.setQuantity(quantity);
    newCartItem.setDiscount(product.getDiscountPrice());
    newCartItem.setProductPrice(product.getSpecialPrice());

    cartItemRepository.save(newCartItem);

    cart.getCartItems().add(newCartItem);

    product.setQuantity(product.getQuantity());

    cart.setTotalPrice(cart.getTotalPrice() + (product.getSpecialPrice() * quantity));

    cartRepository.save(cart);

    return getCartDTO(cart);
  }

  @Override
  public List<CartDTO> getAllCarts() {
    List<Cart> carts = cartRepository.findAll();

    if (carts.isEmpty()) {
      throw new APIException("No cart exists");
    }

    return carts.stream()
        .map(
            cart -> {
              CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);

              List<ProductDTO> products =
                  cart.getCartItems().stream()
                      .map(
                          cartItem -> {
                            ProductDTO productDTO =
                                modelMapper.map(cartItem.getProduct(), ProductDTO.class);
                            productDTO.setQuantity(
                                cartItem.getQuantity()); // Set the quantity from CartItem
                            productDTO.setImage(constructImageUrl(productDTO.getImage()));
                            return productDTO;
                          })
                      .collect(Collectors.toList());

              cartDTO.setProducts(products);

              return cartDTO;
            })
        .collect(Collectors.toList());
  }

  @Override
  public CartDTO getCart(String emailId, Long cartId) {
    Cart cart = cartRepository.findCartByEmailAndCartId(emailId, cartId);
    if (cart == null) {
      throw new ResourceNotFoundException("Cart", "cartId", cartId);
    }
    CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
    cart.getCartItems().forEach(c -> c.getProduct().setQuantity(c.getQuantity()));
    List<ProductDTO> products =
        cart.getCartItems().stream()
            .map(
                p -> {
                  ProductDTO productDTO = modelMapper.map(p.getProduct(), ProductDTO.class);
                  productDTO.setImage(constructImageUrl(productDTO.getImage()));
                  return productDTO;
                })
            .toList();
    cartDTO.setProducts(products);
    return cartDTO;
  }

  @Transactional
  @Override
  public CartDTO updateProductQuantityCart(Long productId, Integer quantity) {

    String emailId = authUtil.loggedInEmail();
    Cart userCart = cartRepository.findCartByEmail(emailId);
    Long cartId = userCart.getCartId();

    Cart cart =
        cartRepository
            .findById(cartId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

    Product product =
        productRepository
            .findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

    if (product.getQuantity() == 0) {
      throw new APIException(product.getProductName() + " is not available");
    }

    if (product.getQuantity() < quantity) {
      throw new APIException(
          "Please, make an order of the "
              + product.getProductName()
              + " less than or equal to the quantity "
              + product.getQuantity()
              + ".");
    }

    CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(cartId, productId);

    if (cartItem == null) {
      throw new APIException(
          "Product " + product.getProductName() + " not available in the cart!!!");
    }

    // Calculate new quantity
    int newQuantity = cartItem.getQuantity() + quantity;

    // Validation to prevent negative quantities
    if (newQuantity < 0) {
      throw new APIException("The resulting quantity cannot be negative.");
    }

    if (newQuantity == 0) {
      deleteProductFromCart(cartId, productId);
    } else {
      cartItem.setProductPrice(product.getSpecialPrice());
      cartItem.setQuantity(cartItem.getQuantity() + quantity);
      cartItem.setDiscount(product.getDiscountPrice());
      cart.setTotalPrice(cart.getTotalPrice() + (cartItem.getProductPrice() * quantity));
      cartRepository.save(cart);
    }

    CartItem updatedItem = cartItemRepository.save(cartItem);
    if (updatedItem.getQuantity() == 0) {
      cartItemRepository.deleteById(updatedItem.getCartItemId());
    }

    return getCartDTO(cart);
  }

  @NonNull
  private CartDTO getCartDTO(Cart cart) {
    CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);

    List<CartItem> cartItems = cart.getCartItems();

    Stream<ProductDTO> productStream =
        cartItems.stream()
            .map(
                item -> {
                  ProductDTO prd = modelMapper.map(item.getProduct(), ProductDTO.class);
                  prd.setQuantity(item.getQuantity());
                  prd.setImage(constructImageUrl(prd.getImage()));
                  return prd;
                });

    cartDTO.setProducts(productStream.toList());

    return cartDTO;
  }

  private String constructImageUrl(String imageName) {
    if (imageName == null || imageName.isBlank()) {
      return imageName;
    }

    if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
      return imageName;
    }

    return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageName : imageBaseUrl + "/" + imageName;
  }

  private Cart createCart() {
    Cart userCart = cartRepository.findCartByEmail(authUtil.loggedInEmail());
    if (userCart != null) {
      return userCart;
    }

    Cart cart = new Cart();
    cart.setTotalPrice(0.00);
    cart.setUser(authUtil.loggedInUser());

    return cartRepository.save(cart);
  }

  @Transactional
  @Override
  public String deleteProductFromCart(Long cartId, Long productId) {
    Cart cart =
        cartRepository
            .findById(cartId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

    CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(cartId, productId);

    if (cartItem == null) {
      throw new ResourceNotFoundException("Product", "productId", productId);
    }

    cart.setTotalPrice(
        cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity()));

    cartItemRepository.deleteCartItemByProductIdAndCartId(cartId, productId);

    return "Product " + cartItem.getProduct().getProductName() + " removed from the cart";
  }

  @Override
  public void updateProductInCarts(Long cartId, Long productId) {
    Cart cart =
        cartRepository
            .findById(cartId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

    Product product =
        productRepository
            .findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

    CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(cartId, productId);

    if (cartItem == null) {
      throw new APIException("Product " + product.getProductName() + " not available in the cart");
    }

    double cartPrice = cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity());

    cartItem.setProductPrice(product.getSpecialPrice());

    cart.setTotalPrice(cartPrice + (cartItem.getProductPrice() * cartItem.getQuantity()));

    cartItem = cartItemRepository.save(cartItem);
  }

  //  @Override
  //  public String createOrUpdateCartWithItems(List<CartItemsDTO> cartItemsDTO) {
  //    return "";
  //  }

  @Transactional
  @Override
  public String createOrUpdateCartWithItems(List<CartItemsDTO> cartItems) {
    // Get user's email
    String emailId = authUtil.loggedInEmail();

    // Check if an existing cart is available or create a new one
    Cart existingCart = cartRepository.findCartByEmail(emailId);
    if (existingCart == null) {
      existingCart = new Cart();
      existingCart.setTotalPrice(0.00);
      existingCart.setUser(authUtil.loggedInUser());
      existingCart = cartRepository.save(existingCart);
    } else {
      // Clear all current items in the existing cart
      cartItemRepository.deleteAllByCartId(existingCart.getCartId());
    }

    double totalPrice = 0.00;

    // Process each item in the request to add to the cart
    for (CartItemsDTO cartItemDTO : cartItems) {
      Long productId = cartItemDTO.getProductId();
      Integer quantity = cartItemDTO.getQuantity();

      // Find the product by ID
      Product product =
          productRepository
              .findById(productId)
              .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

      // Directly update product stock and total price
      // product.setQuantity(product.getQuantity() - quantity);
      totalPrice += product.getSpecialPrice() * quantity;

      // Create and save cart item
      CartItem cartItem = new CartItem();
      cartItem.setProduct(product);
      cartItem.setCart(existingCart);
      cartItem.setQuantity(quantity);
      cartItem.setProductPrice(product.getSpecialPrice());
      cartItem.setDiscount(product.getDiscountPrice());
      cartItemRepository.save(cartItem);
    }

    // Update the cart's total price and save
    existingCart.setTotalPrice(totalPrice);
    cartRepository.save(existingCart);
    return "Cart created/updated with the new items successfully";
  }
}
