package org.platforma.onlineshop.security;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
  private Long id;
  private String token;
  private String username;
  private String email;
  private List<String> roles;
  private String firstName;
  private String lastName;

  public LoginResponse(
      Long id,
      String username,
      List<String> roles,
      String email,
      String token,
      String firstName,
      String lastName) {
    this.id = id;
    this.token = token;
    this.username = username;
    this.roles = roles;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
