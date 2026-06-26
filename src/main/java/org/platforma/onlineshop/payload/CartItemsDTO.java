package org.platforma.onlineshop.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemsDTO {
  private Long productId;
  private Integer quantity;
}
