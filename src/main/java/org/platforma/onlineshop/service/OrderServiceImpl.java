package org.platforma.onlineshop.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.modelmapper.ModelMapper;
import org.platforma.onlineshop.exceptions.APIException;
import org.platforma.onlineshop.exceptions.ResourceNotFoundException;
import org.platforma.onlineshop.model.*;
import org.platforma.onlineshop.payload.OrderDTO;
import org.platforma.onlineshop.payload.OrderItemDTO;
import org.platforma.onlineshop.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService {
  @Autowired ModelMapper modelMapper;
  @Autowired CartService cartService;
  @Autowired CartRepository cartRepository;
  @Autowired AddressRepository addressRepository;
  @Autowired PaymentRepository paymentRepository;
  @Autowired OrderRepository orderRepository;
  @Autowired OrderItemRepository orderItemRepository;
  @Autowired ProductRepository productRepository;

  @Override
  public OrderDTO placeOrder(
      String emailId,
      Long addressId,
      String paymentMethod,
      String pgName,
      String pgPaymentId,
      String pgStatus,
      String pgResponseMessage) {
    // Getting user cart
    Cart cart = cartRepository.findCartByEmail(emailId);
    if (cart == null) {
      throw new ResourceNotFoundException("Cart", "email", emailId);
    }

    Address address =
        addressRepository
            .findById(addressId)
            .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));
    // Create a new order with payment info
    Order order = new Order();
    order.setEmail(emailId);
    order.setDate(LocalDate.now());
    order.setTotalAmount(cart.getTotalPrice());
    order.setOrderStatus("Order Accepted");

    Payment payment = new Payment(paymentMethod, pgPaymentId, pgStatus, pgResponseMessage, pgName);
    payment.setOrder(order);
    payment = paymentRepository.save(payment);
    order.setPayment(payment);

    Order savedOrder = orderRepository.save(order);

    // Get items from the cart
    List<CartItem> cartItems = cart.getCartItems();
    if (cartItems.isEmpty()) {
      throw new APIException("Cart is empty");
    }

    List<OrderItem> orderItems = new ArrayList<>();
    for (CartItem cartItem : cartItems) {
      OrderItem orderItem = new OrderItem();
      orderItem.setProduct(cartItem.getProduct());
      orderItem.setQuantity(cartItem.getQuantity());
      orderItem.setDiscount(cartItem.getDiscount());
      orderItem.setOrderedProductPrice(cartItem.getProductPrice());
      orderItem.setOrder(savedOrder);
      orderItems.add(orderItem);
    }

    orderItemRepository.saveAll(orderItems);
    // update product stock
    cart.getCartItems()
        .forEach(
            cartItem -> {
              int quantity = cartItem.getQuantity();
              Product product = cartItem.getProduct();
              product.setQuantity(product.getQuantity() - quantity);
              productRepository.save(product);

              cartService.deleteProductFromCart(
                  cart.getCartId(), cartItem.getProduct().getProductId());
            });
    // clear the cart
    // send back order summary
    OrderDTO orderDTO = modelMapper.map(savedOrder, OrderDTO.class);
    orderItems.forEach(
        orderItem -> orderDTO.getOrderItems().add(modelMapper.map(orderItem, OrderItemDTO.class)));
    orderDTO.setAddressId(addressId);
    return orderDTO;
  }
}
