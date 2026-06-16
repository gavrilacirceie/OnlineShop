package org.platforma.onlineshop.controller;

import java.util.List;
import org.platforma.onlineshop.model.Cart;
import org.platforma.onlineshop.payload.CartDTO;
import org.platforma.onlineshop.repositories.CartRepository;
import org.platforma.onlineshop.service.CartService;
import org.platforma.onlineshop.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CartController {
  @Autowired private CartRepository cartRepository;
  @Autowired private AuthUtil authUtil;
  @Autowired private CartService cartService;

  @PostMapping("/carts/products/{productId}/quantity/{quantity}")
  public ResponseEntity<CartDTO> addProductToCart(
      @PathVariable Long productId, @PathVariable Integer quantity) {
    CartDTO cartDTO = cartService.addProductToCart(productId, quantity);
    return new ResponseEntity<>(cartDTO, HttpStatus.OK);
  }

  @GetMapping("/carts")
  public ResponseEntity<List<CartDTO>> getAllCarts() {
    List<CartDTO> cartDTOS = cartService.getAllCarts();
    return new ResponseEntity<>(cartDTOS, HttpStatus.FOUND);
  }

  @GetMapping("/carts/users/cart")
  public ResponseEntity<CartDTO> getCartsByUserId() {
    String emailId = authUtil.loggedInEmail();
    Cart cart = cartRepository.findCartByEmail(emailId);
    Long cartId = cart.getCartId();
    CartDTO cartDTO = cartService.getCart(emailId, cartId);
    return new ResponseEntity<>(cartDTO, HttpStatus.OK);
  }

  @PutMapping("/cart/products/{productId}/quantity/{operation}")
  public ResponseEntity<CartDTO> updateProduct(
      @PathVariable Long productId, @PathVariable String operation) {
    CartDTO cartDTO =
        cartService.updateProductQuantityCart(
            productId, operation.equalsIgnoreCase("delete") ? -1 : 1);
    return new ResponseEntity<>(cartDTO, HttpStatus.OK);
  }

  @DeleteMapping("/carts/{cartId}/product/{productId}")
  public ResponseEntity<String> deleteCart(
      @PathVariable Long productId, @PathVariable Long cartId) {
    String status = cartService.deleteProductFromCart(cartId, productId);
    return new ResponseEntity<>(status, HttpStatus.OK);
  }
}
