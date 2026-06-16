package org.platforma.onlineshop.service;

import jakarta.transaction.Transactional;
import org.platforma.onlineshop.payload.OrderDTO;

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
}
