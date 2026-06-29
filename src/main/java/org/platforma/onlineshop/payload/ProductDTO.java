package org.platforma.onlineshop.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
  private Long productId;
  private String productName;
  private String productDescription;
  private String image;
  private Integer quantity;
  private Double productPrice;
  private Double specialPrice;
  private Double discountPrice;
  private String sellerName;
}
