package org.platforma.onlineshop.service;

import jakarta.transaction.Transactional;
import org.platforma.onlineshop.payload.OrderDTO;
import org.platforma.onlineshop.payload.OrderResponse;

public interface OrderService {
  @Transactional
  OrderDTO placeOrder(
      String emailId,
      Long addressId,
      String paymentMethod,
      String pgName,
      String pgPaymentId,
      String pgStatus,
      String pgResponseMessage);

  OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

  @Transactional
  OrderDTO updateOrder(Long orderId, String status);

  OrderResponse getSellerOrders(
      Long sellerId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

  OrderResponse getUserOrders(
      String email, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
}
