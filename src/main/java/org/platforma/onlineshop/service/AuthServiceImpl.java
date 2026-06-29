package org.platforma.onlineshop.service;

import jakarta.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.platforma.onlineshop.model.AppRole;
import org.platforma.onlineshop.model.Role;
import org.platforma.onlineshop.model.User;
import org.platforma.onlineshop.payload.AuthenticationResult;
import org.platforma.onlineshop.payload.UserDTO;
import org.platforma.onlineshop.payload.UserResponse;
import org.platforma.onlineshop.repositories.RoleRepository;
import org.platforma.onlineshop.repositories.UserRepository;
import org.platforma.onlineshop.security.*;
import org.platforma.onlineshop.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

  @Autowired private AuthenticationManager authenticationManager;

  @Autowired JwtUtils jwtUtils;

  @Autowired UserRepository userRepository;

  @Autowired RoleRepository roleRepository;

  @Autowired PasswordEncoder passwordEncoder;

  @Autowired
  ModelMapper modelMapper;

  @Override
  public AuthenticationResult login(LoginRequest loginRequest) {
    Authentication authentication;
    authentication =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    ResponseCookie jwtCookie = jwtUtils.getResponseCookie(userDetails);
    List<String> roles =
        userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

    LoginResponse loginResponse =
        new LoginResponse(
            userDetails.getId(),
            userDetails.getUsername(),
            roles,
            userDetails.getEmail(),
            jwtCookie.getValue(),
            userDetails.getFirstName(),
            userDetails.getLastName());

    return new AuthenticationResult(loginResponse, jwtCookie);
  }

  @Override
  public ResponseEntity<MessageResponse> register(SignupRequest signupRequest) {
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
            signupRequest.getUsername(),
                signupRequest.getFirstName(),
                signupRequest.getLastName());

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

    @Override
  public LoginResponse getUserDetails(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles =
                userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
        LoginResponse loginResponse =
                new LoginResponse(
                        userDetails.getId(),
                        userDetails.getUsername(),
                        roles,
                        userDetails.getEmail(),
                        null,
                        userDetails.getFirstName(),
                        userDetails.getLastName());

        return loginResponse;
    }

    @Override
    public AuthenticationResult updateUserDetails(
            ProfileUpdateRequest profileUpdateRequest, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user =
                userRepository
                        .findById(userDetails.getId())
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        boolean usernameChanged =
                !user.getUsername().equals(profileUpdateRequest.getUsername());
        boolean emailChanged = !user.getEmail().equals(profileUpdateRequest.getEmail());

        if (usernameChanged && userRepository.existsByUsername(profileUpdateRequest.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
        }

        if (emailChanged && userRepository.existsByEmail(profileUpdateRequest.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        user.setFirstName(profileUpdateRequest.getFirstName());
        user.setLastName(profileUpdateRequest.getLastName());
        user.setUsername(profileUpdateRequest.getUsername());
        user.setEmail(profileUpdateRequest.getEmail());

        User updatedUser = userRepository.save(user);
        UserDetailsImpl updatedUserDetails = UserDetailsImpl.build(updatedUser);
        ResponseCookie jwtCookie = jwtUtils.getResponseCookie(updatedUserDetails);
        List<String> roles =
                updatedUserDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList();

        LoginResponse loginResponse =
                new LoginResponse(
                        updatedUserDetails.getId(),
                        updatedUserDetails.getUsername(),
                        roles,
                        updatedUserDetails.getEmail(),
                        jwtCookie.getValue(),
                        updatedUserDetails.getFirstName(),
                        updatedUserDetails.getLastName());

        return new AuthenticationResult(loginResponse, jwtCookie);
    }

    @Override
    public UserResponse getAllSellers(Pageable pageDetails) {
        Page<User> allUsers = userRepository.findByRoleName((AppRole.ROLE_SELLER), pageDetails);
        List<UserDTO> userDtos = allUsers.getContent()
                .stream()
                .map(p -> modelMapper.map(p, UserDTO.class))
                .collect(Collectors.toList());

        UserResponse response = new UserResponse();
        response.setContent(userDtos);
        response.setPageNumber(allUsers.getNumber());
        response.setPageSize(allUsers.getSize());
        response.setTotalElements(allUsers.getTotalElements());
        response.setTotalPages(allUsers.getTotalPages());
        response.setLastPage(allUsers.isLast());
        return response;
    }
}
