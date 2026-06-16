package org.platforma.onlineshop.payload;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
  private List<ProductDTO> content;
  private Integer pageNumber;
  private Integer pageSize;
  private Integer totalPages;
  private Integer totalItems;
  private boolean lastPage;
}
