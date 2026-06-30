package org.platforma.onlineshop.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long productId;

  @NotBlank
  @Size(min = 1, message = "Product name must contain atleast 3 characters")
  private String productName;

  @NotBlank
  @Size(min = 1, message = "Product name must contain atleast 6 characters")
  @Lob
  @Column(columnDefinition = "TEXT")
  private String productDescription;

  private String image;
  private Integer quantity;
  private double productPrice;
  private double discountPrice;
  private double specialPrice;

  @ManyToOne
  @JoinColumn(name = "category_id")
  Category category;

  @ManyToOne
  @JoinColumn(name = "user_id")
  User user;

  @OneToMany(
      mappedBy = "product",
      cascade = {CascadeType.PERSIST, CascadeType.MERGE},
      fetch = FetchType.EAGER)
  private List<CartItem> products = new ArrayList<>();
}
