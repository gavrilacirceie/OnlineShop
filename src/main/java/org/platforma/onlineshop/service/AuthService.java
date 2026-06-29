package org.platforma.onlineshop.service;

import jakarta.validation.Valid;
import org.platforma.onlineshop.payload.AuthenticationResult;
import org.platforma.onlineshop.payload.UserResponse;
import org.platforma.onlineshop.security.LoginRequest;
import org.platforma.onlineshop.security.LoginResponse;
import org.platforma.onlineshop.security.MessageResponse;
import org.platforma.onlineshop.security.ProfileUpdateRequest;
import org.platforma.onlineshop.security.SignupRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

public interface AuthService {
  AuthenticationResult login(LoginRequest loginRequest);

  ResponseEntity<MessageResponse> register(@Valid SignupRequest signupRequest);

    LoginResponse getUserDetails(Authentication authentication);

    AuthenticationResult updateUserDetails(
        @Valid ProfileUpdateRequest profileUpdateRequest, Authentication authentication);

    UserResponse getAllSellers(Pageable pageDetails);
}
