package org.platforma.onlineshop.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@Table(
    name = "users",
    uniqueConstraints = {
      @UniqueConstraint(columnNames = "username"),
      @UniqueConstraint(columnNames = "email")
    })
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Size(max = 20)
  @NotBlank
  private String username;

  @Size(max = 100)
  @NotBlank
  private String password;

  @Email
  @Size(max = 100)
  @NotBlank
  private String email;

  @Size(max = 100)
  @NotBlank
  private String firstName;

  @Size(max = 100)
  @NotBlank
  private String lastName;

  public User(String password, String email, String username, String firstName, String lastName) {
    this.password = password;
    this.email = email;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }

  @ManyToMany(
      cascade = {CascadeType.PERSIST, CascadeType.MERGE},
      fetch = FetchType.EAGER)
  @JoinTable(
      name = "user_role",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<Role> roles = new HashSet<>();

  @ToString.Exclude
  @OneToOne(
      mappedBy = "user",
      cascade = {CascadeType.PERSIST, CascadeType.MERGE},
      orphanRemoval = true)
  private Cart cart;

  @OneToMany(
      mappedBy = "user",
      cascade = {CascadeType.PERSIST, CascadeType.MERGE},
      orphanRemoval = true)
  @ToString.Exclude
  private Set<Product> products = new HashSet<>();

  @OneToMany(
      mappedBy = "user",
      cascade = {CascadeType.PERSIST, CascadeType.MERGE},
      orphanRemoval = true)
  //  @JoinTable(
  //      name = "user_address",
  //      joinColumns = @JoinColumn(name = "user_id"),
  //      inverseJoinColumns = @JoinColumn(name = "adddress_id"))
  @Getter
  @Setter
  private List<Address> addresses = new ArrayList<>();
}
