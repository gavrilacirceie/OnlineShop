package org.platforma.onlineshop.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Size(min = 1, max = 255, message = "street name need to be 5 char more")
  private String street;

  @NotBlank
  @Size(min = 1, max = 255, message = "buildingName name need to be 5 char more")
  private String buildingName;

  @NotBlank
  @Size(min = 1, max = 255, message = "city name need to be 5 char more")
  private String city;

  @NotBlank
  @Size(min = 1, max = 255, message = "state name need to be 5 char more")
  private String state;

  @NotBlank
  @Size(min = 1, max = 255, message = "country name need to be 5 char more")
  private String country;

  @NotBlank
  @Size(min = 1, max = 255, message = "pincode name need to be 5 char more")
  private String pincode;

  @ToString.Exclude
  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  public Address(
      String street,
      String buildingName,
      String city,
      String state,
      String country,
      String pincode) {
    this.street = street;
    this.buildingName = buildingName;
    this.city = city;
    this.state = state;
    this.country = country;
    this.pincode = pincode;
  }
}
