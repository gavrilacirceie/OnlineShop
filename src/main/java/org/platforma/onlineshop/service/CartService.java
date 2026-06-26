package org.platforma.onlineshop.service;

import jakarta.transaction.Transactional;
import java.util.List;
import org.platforma.onlineshop.payload.CartDTO;
import org.platforma.onlineshop.payload.CartItemsDTO;

public interface CartService {
  CartDTO addProductToCart(Long productId, Integer quantity);

  List<CartDTO> getAllCarts();

  CartDTO getCart(String emailId, Long cartId);

  @Transactional
  CartDTO updateProductQuantityCart(Long productId, Integer quantity);

  String deleteProductFromCart(Long cartId, Long productId);

  void updateProductInCarts(Long cartId, Long productId);

  String createOrUpdateCartWithItems(List<CartItemsDTO> cartItemsDTO);
}
