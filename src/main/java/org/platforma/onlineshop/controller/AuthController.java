package org.platforma.onlineshop.controller;

import jakarta.validation.Valid;
import java.util.*;
import org.platforma.onlineshop.config.AppConstants;
import org.platforma.onlineshop.payload.AuthenticationResult;
import org.platforma.onlineshop.repositories.RoleRepository;
import org.platforma.onlineshop.repositories.UserRepository;
import org.platforma.onlineshop.security.*;
import org.platforma.onlineshop.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/auth")
@RestController
public class AuthController {
  @Autowired private JwtUtils jwtUtils;

  @Autowired AuthenticationManager authenticationManager;

  @Autowired UserRepository userRepository;

  @Autowired PasswordEncoder passwordEncoder;

  @Autowired RoleRepository roleRepository;

  @Autowired AuthService authService;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticate(@RequestBody LoginRequest loginRequest) {
    AuthenticationResult response = authService.login(loginRequest);

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, String.valueOf(response.getJwtCookie()))
        .body(response.getLoginResponse());
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
    return authService.register(signupRequest);
  }

  @GetMapping("/username")
  public String currentUsername(Authentication authentication) {
    if (authentication != null) {
      return authentication.getName();
    }
    return "";
  }

  @GetMapping("/user")
  public ResponseEntity<?> getUserDetails(Authentication authentication) {
    return ResponseEntity.ok().body(authService.getUserDetails(authentication));
  }

  @PutMapping("/user")
  public ResponseEntity<?> updateUserDetails(
      @Valid @RequestBody ProfileUpdateRequest profileUpdateRequest,
      Authentication authentication) {
    AuthenticationResult response =
        authService.updateUserDetails(profileUpdateRequest, authentication);

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, String.valueOf(response.getJwtCookie()))
        .body(response.getLoginResponse());
  }

  @PostMapping("/signout")
  public ResponseEntity<?> signoutUser() {
    ResponseCookie cookie = jwtUtils.cleanJwtCookie();
    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new MessageResponse("You've been signed out!"));
  }

  @GetMapping("/sellers")
  public ResponseEntity<?> getAllSellers(
      @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false)
          Integer pageNumber) {

    Sort sortByAndOrder = Sort.by(AppConstants.SORT_USERS_BY).descending();
    Pageable pageDetails =
        PageRequest.of(pageNumber, Integer.parseInt(AppConstants.PAGE_SIZE), sortByAndOrder);

    return ResponseEntity.ok(authService.getAllSellers(pageDetails));
  }
}
