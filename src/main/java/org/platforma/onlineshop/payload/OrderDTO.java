package org.platforma.onlineshop.payload;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
  private long id;
  private String email;
  private List<OrderItemDTO> orderItems = new ArrayList<>();
  private LocalDate date;
  private PaymentDTO payment;
  private Double totalAmount;
  private String orderStatus;
  private Long addressId;
  private AddressDTO address;
}
