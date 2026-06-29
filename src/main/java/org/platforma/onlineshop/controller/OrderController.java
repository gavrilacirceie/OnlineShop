package org.platforma.onlineshop.controller;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.validation.Valid;
import org.platforma.onlineshop.config.AppConstants;
import org.platforma.onlineshop.payload.OrderDTO;
import org.platforma.onlineshop.payload.OrderRequestDTO;
import org.platforma.onlineshop.payload.OrderResponse;
import org.platforma.onlineshop.payload.OrderStatusUpdateDto;
import org.platforma.onlineshop.payload.StripePaymentDTO;
import org.platforma.onlineshop.service.OrderService;
import org.platforma.onlineshop.service.StripeService;
import org.platforma.onlineshop.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {
  @Autowired private OrderService orderService;

  @Autowired private AuthUtil authUtil;

  @Autowired private StripeService stripeService;

  @PostMapping("/order/users/payments/{paymentMethod}")
  public ResponseEntity<OrderDTO> orderProducts(
      @PathVariable String paymentMethod, @RequestBody OrderRequestDTO orderRequestDTO) {
    String emailId = authUtil.loggedInEmail();

    OrderDTO order =
        orderService.placeOrder(
            emailId,
            orderRequestDTO.getAddressId(),
            paymentMethod,
            orderRequestDTO.getPgName(),
            orderRequestDTO.getPgPaymentId(),
            orderRequestDTO.getPgStatus(),
            orderRequestDTO.getPgResponseMessage());
    return new ResponseEntity<>(order, HttpStatus.CREATED);
  }

  @PostMapping("/order/stripe-client-secret")
  public ResponseEntity<String> createStripeClient(@RequestBody StripePaymentDTO stripePaymentDTO)
      throws StripeException {
    PaymentIntent paymentIntent = stripeService.paymentIntent(stripePaymentDTO);
    return new ResponseEntity<>(paymentIntent.getClientSecret(), HttpStatus.CREATED);
  }

  @GetMapping("/admin/orders")
  public ResponseEntity<OrderResponse> getAllOrders(
          @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false)
          Integer pageNumber,
          @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false)
          Integer pageSize,
          @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ORDERS_BY, required = false)
          String sortBy,
          @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false)
          String sortOrder
  ) {
      OrderResponse orderResponse = orderService.getAllOrders(pageNumber, pageSize, sortBy, sortOrder);
      return new ResponseEntity<OrderResponse>(orderResponse, HttpStatus.OK);
  }

  @PutMapping("/admin/orders/{orderId}/status")
  public ResponseEntity<OrderDTO> updateOrderStatus(
      @PathVariable Long orderId, @Valid @RequestBody OrderStatusUpdateDto orderStatusUpdateDto) {
    OrderDTO order = orderService.updateOrder(orderId, orderStatusUpdateDto.getStatus());
    return new ResponseEntity<>(order, HttpStatus.OK);
  }
}
