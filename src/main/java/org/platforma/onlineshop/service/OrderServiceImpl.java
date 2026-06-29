package org.platforma.onlineshop.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.modelmapper.ModelMapper;
import org.platforma.onlineshop.exceptions.APIException;
import org.platforma.onlineshop.exceptions.ResourceNotFoundException;
import org.platforma.onlineshop.model.*;
import org.platforma.onlineshop.payload.*;
import org.platforma.onlineshop.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService {
  private static final Map<String, String> ALLOWED_ORDER_STATUSES =
      Map.of(
          "pending", "Pending",
          "processing", "Processing",
          "shipped", "Shipped",
          "delivered", "Delivered",
          "cancelled", "Cancelled",
          "accepted", "Accepted");

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
    Cart cart = cartRepository.findCartByEmail(emailId);
    if (cart == null) {
      throw new ResourceNotFoundException("Cart", "email", emailId);
    }

    Address address =
        addressRepository
            .findById(addressId)
            .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));
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
    OrderDTO orderDTO = modelMapper.map(savedOrder, OrderDTO.class);
    orderItems.forEach(
        orderItem -> orderDTO.getOrderItems().add(modelMapper.map(orderItem, OrderItemDTO.class)));
    orderDTO.setAddressId(addressId);
    return orderDTO;
  }

  @Override
  public OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
    Sort sortByAndOrder =
            sortOrder.equalsIgnoreCase("asc")
                    ? Sort.by(Sort.Direction.ASC, sortBy)
                    : Sort.by(Sort.Direction.DESC, sortBy);
    Pageable pageable = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
    Page<Order> orderPage = orderRepository.findAll(pageable);

    List<Order> orders = orderPage.getContent();
    if (orders.isEmpty()) {
      throw new APIException("No orders found");
    }
    List<OrderDTO> orderDTOS =
            orders.stream().map(category -> modelMapper.map(category, OrderDTO.class)).toList();

    OrderResponse orderResponse = new OrderResponse();
    orderResponse.setContent(orderDTOS);
    orderResponse.setPageNumber(orderPage.getNumber());
    orderResponse.setPageSize(orderPage.getSize());
    orderResponse.setTotalElements((long) orderPage.getTotalElements());
    orderResponse.setTotalPages(orderPage.getTotalPages());
    orderResponse.setLastPage(orderPage.isLast());

    return orderResponse;
  }

  @Override
  public OrderDTO updateOrder(Long orderId, String status) {
    Order order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

    String updatedStatus = ALLOWED_ORDER_STATUSES.get(status.trim().toLowerCase());
    if (updatedStatus == null) {
      throw new APIException(
          "Invalid order status. Allowed values: Pending, Processing, Shipped, Delivered, Cancelled, Accepted");
    }

    order.setOrderStatus(updatedStatus);
    Order savedOrder = orderRepository.save(order);
    OrderDTO orderDTO = modelMapper.map(savedOrder, OrderDTO.class);
    if (savedOrder.getAddress() != null) {
      orderDTO.setAddressId(savedOrder.getAddress().getId());
    }
    return orderDTO;
  }
}
