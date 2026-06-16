package org.platforma.onlineshop.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.*;

@Entity(name = "categories")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Category {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long categoryId;

  @NotBlank
  @Size(min = 5, message = "Category name must contain atleast 5 characters")
  private String categoryName;

  @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
  private List<Product> products;
}
