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

  public LoginResponse(Long id, String token, String username, List<String> roles) {
    this.id = id;
    this.token = token;
    this.username = username;
    this.roles = roles;
  }

  public LoginResponse(Long id, String username, List<String> roles, String email, String token) {
    this.id = id;
    this.token = token;
    this.username = username;
    this.roles = roles;
    this.email = email;
  }

  public LoginResponse(Long id, String username, List<String> roles) {
    this.id = id;
    this.username = username;
    this.roles = roles;
  }
}
