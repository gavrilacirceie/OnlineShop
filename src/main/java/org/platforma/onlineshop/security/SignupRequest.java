package org.platforma.onlineshop.security;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;
import lombok.Data;

@Data
public class SignupRequest {
  @NotBlank
  @Size(min = 3, max = 20)
  private String username;

  @NotBlank
  @Size(min = 3, max = 30)
  private String password;

  @NotBlank
  @Size(min = 3, max = 20)
  @Email
  private String email;

  private Set<String> roles;
}
