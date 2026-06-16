package org.platforma.onlineshop.security.config;

import java.util.Set;
import org.platforma.onlineshop.model.AppRole;
import org.platforma.onlineshop.model.Role;
import org.platforma.onlineshop.model.User;
import org.platforma.onlineshop.repositories.RoleRepository;
import org.platforma.onlineshop.repositories.UserRepository;
import org.platforma.onlineshop.security.AuthEntryPointJwt;
import org.platforma.onlineshop.security.AuthTokenFilter;
import org.platforma.onlineshop.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
// @EnableMethodSecurity
public class WebSecurityConfig {
  @Autowired UserDetailsServiceImpl userDetailsService;
  @Autowired private AuthEntryPointJwt unauthorizedHandler;

  @Bean
  public AuthTokenFilter authTokenFilterBean() {
    return new AuthTokenFilter();
  }

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());

    return authProvider;
  }

  @Bean
  public AuthenticationManager authenticationManagerBean(
      AuthenticationConfiguration authenticationConfiguration) throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
        .sessionManagement(
            sessionManagement ->
                sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            (requests) ->
                requests
                    .requestMatchers("/api/auth/**")
                    .permitAll()
                    .requestMatchers("/v3/api-docs/**")
                    .permitAll()
                    .requestMatchers("/swagger-ui/**")
                    .permitAll()
                    // .requestMatchers("/api/public/**")
                    // .permitAll()
                    // .requestMatchers("/api/admin/**")
                    // .permitAll()
                    .requestMatchers("/api/test/**")
                    .permitAll()
                    .requestMatchers("/images/**")
                    .permitAll()
                    .requestMatchers("/h2-console/**")
                    .permitAll()
                    .requestMatchers("/error")
                    .permitAll()
                    .anyRequest()
                    .authenticated());
    http.authenticationProvider(authenticationProvider());
    http.addFilterBefore(authTokenFilterBean(), UsernamePasswordAuthenticationFilter.class);
    http.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin));
    return http.build();
  }

  @Bean
  public WebSecurityCustomizer webSecurityCustomizer() {
    return (web ->
        web.ignoring()
            .requestMatchers(
                "/v2/api-docs",
                "/configuration/ui",
                "/swagger-resources/**",
                "/configuration/security",
                "/swagger-ui.html",
                "/webjars/**"));
  }

  @Bean
  public CommandLineRunner initData(
      RoleRepository roleRepository,
      UserRepository userRepository,
      PasswordEncoder passwordEncoder) {
    return args -> {
      // Retrieve or create roles
      Role userRole =
          roleRepository
              .findByRoleName(AppRole.ROLE_USER)
              .orElseGet(
                  () -> {
                    Role newUserRole = new Role(AppRole.ROLE_USER);
                    return roleRepository.save(newUserRole);
                  });

      Role sellerRole =
          roleRepository
              .findByRoleName(AppRole.ROLE_SELLER)
              .orElseGet(
                  () -> {
                    Role newSellerRole = new Role(AppRole.ROLE_SELLER);
                    return roleRepository.save(newSellerRole);
                  });

      Role adminRole =
          roleRepository
              .findByRoleName(AppRole.ROLE_ADMIN)
              .orElseGet(
                  () -> {
                    Role newAdminRole = new Role(AppRole.ROLE_ADMIN);
                    return roleRepository.save(newAdminRole);
                  });

      Set<Role> userRoles = Set.of(userRole);
      Set<Role> sellerRoles = Set.of(sellerRole);
      Set<Role> adminRoles = Set.of(userRole, sellerRole, adminRole);

      // Create users if not already present
      if (!userRepository.existsByUsername("user1")) {
        User user1 = new User(passwordEncoder.encode("password1"), "user1@example.com", "user1");
        userRepository.save(user1);
      }

      if (!userRepository.existsByUsername("seller1")) {
        User seller1 =
            new User(passwordEncoder.encode("password2"), "seller1@example.com", "seller1");
        userRepository.save(seller1);
      }

      if (!userRepository.existsByUsername("admin")) {
        User admin = new User(passwordEncoder.encode("adminPass"), "admin@example.com", "admin");
        userRepository.save(admin);
      }

      // Update roles for existing users
      userRepository
          .findByUsername("user1")
          .ifPresent(
              user -> {
                user.setRoles(userRoles);
                userRepository.save(user);
              });

      userRepository
          .findByUsername("seller1")
          .ifPresent(
              seller -> {
                seller.setRoles(sellerRoles);
                userRepository.save(seller);
              });

      userRepository
          .findByUsername("admin")
          .ifPresent(
              admin -> {
                admin.setRoles(adminRoles);
                userRepository.save(admin);
              });
    };
  }
}
