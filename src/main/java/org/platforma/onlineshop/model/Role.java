package org.platforma.onlineshop.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
@Table(name = "roles")
public class Role {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "role_id")
  private Integer roleId;

  @Enumerated(EnumType.STRING)
  @Column(length = 20, name = "role_name")
  @ToString.Exclude
  private AppRole roleName;

  public Role(AppRole roleName) {
    this.roleName = roleName;
  }

  public Role() {}
}
