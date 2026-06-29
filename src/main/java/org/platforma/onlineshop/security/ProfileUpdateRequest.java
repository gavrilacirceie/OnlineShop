package org.platforma.onlineshop.security;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileUpdateRequest {
  @NotBlank
  @Size(min = 3, max = 100)
  private String firstName;

  @NotBlank
  @Size(min = 3, max = 100)
  private String lastName;

  @NotBlank
  @Size(min = 3, max = 20)
  private String username;

  @NotBlank
  @Email
  @Size(max = 100)
  private String email;
}
