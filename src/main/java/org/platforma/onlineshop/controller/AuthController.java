package org.platforma.onlineshop.controller;

import jakarta.validation.Valid;
import java.util.*;
import org.platforma.onlineshop.model.AppRole;
import org.platforma.onlineshop.model.Role;
import org.platforma.onlineshop.model.User;
import org.platforma.onlineshop.repositories.RoleRepository;
import org.platforma.onlineshop.repositories.UserRepository;
import org.platforma.onlineshop.security.*;
import org.platforma.onlineshop.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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

  @PostMapping("/signin")
  public ResponseEntity<?> authenticate(@RequestBody LoginRequest loginRequest) {
    Authentication authentication;
    try {
      authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  loginRequest.getUsername(), loginRequest.getPassword()));
    } catch (AuthenticationException e) {
      Map<String, Object> map = new HashMap<>();
      map.put("message", "Authentication Failed");
      map.put("status", false);
      return new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
    }
    SecurityContextHolder.getContext().setAuthentication(authentication);
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    ResponseCookie jwtCookie = jwtUtils.getResponseCookie(userDetails);
    List<String> roles =
        userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
    LoginResponse loginResponse =
        new LoginResponse(userDetails.getId(), userDetails.getUsername(), roles);

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
        .body(loginResponse);
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
    if (userRepository.existsByUsername(signupRequest.getUsername())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Username already exists"));
    }
    if (userRepository.existsByEmail(signupRequest.getEmail())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Email already exists"));
    }

    User user =
        new User(
            passwordEncoder.encode(signupRequest.getPassword()),
            signupRequest.getEmail(),
            signupRequest.getUsername());

    Set<String> roles = signupRequest.getRoles();
    Set<Role> roleSet = new HashSet<>();

    if (roles == null) {
      Role userRole =
          roleRepository
              .findByRoleName(AppRole.ROLE_USER)
              .orElseThrow(() -> new RuntimeException("Role is not found"));
      roleSet.add(userRole);
    } else {
      roles.forEach(
          role -> {
            switch (role) {
              case "admin":
                Role adminRole =
                    roleRepository
                        .findByRoleName(AppRole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Role is not found"));
                roleSet.add(adminRole);
                break;
              case "seller":
                Role sellerRole =
                    roleRepository
                        .findByRoleName(AppRole.ROLE_SELLER)
                        .orElseThrow(() -> new RuntimeException("Role is not found"));
                roleSet.add(sellerRole);
                break;
              default:
                Role userRole =
                    roleRepository
                        .findByRoleName(AppRole.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("Role is not found"));
                roleSet.add(userRole);
            }
          });
    }
    user.setRoles(roleSet);
    userRepository.save(user);
    return ResponseEntity.ok(new MessageResponse("User registered successfully"));
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
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    List<String> roles =
        userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
    LoginResponse loginResponse =
        new LoginResponse(userDetails.getId(), userDetails.getUsername(), roles);
    return ResponseEntity.ok().body(loginResponse);
  }

  @PostMapping("/signout")
  public ResponseEntity<?> signoutUser() {
    ResponseCookie cookie = jwtUtils.cleanJwtCookie();
    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new MessageResponse("You've been signed out!"));
  }
}
