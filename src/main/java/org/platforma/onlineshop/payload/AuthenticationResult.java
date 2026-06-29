package org.platforma.onlineshop.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.platforma.onlineshop.security.LoginResponse;
import org.springframework.http.ResponseCookie;

@Data
@AllArgsConstructor
public class AuthenticationResult {
  private final LoginResponse loginResponse;
  private final ResponseCookie jwtCookie;
}
