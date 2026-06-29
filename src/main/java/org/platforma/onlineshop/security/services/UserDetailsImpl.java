package org.platforma.onlineshop.security.services;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serial;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.platforma.onlineshop.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@NoArgsConstructor
@Data
public class UserDetailsImpl implements UserDetails {
  @Serial private static final long serialVersionUID = 1L;

  private Long id;
  private String username;
  @JsonIgnore private String password;
  private String email;
  private String firstName;
  private String lastName;
  private Collection<? extends GrantedAuthority> authorities;

  public UserDetailsImpl(
      Long id,
      String username,
      String password,
      String email,
      String firstName,
      String lastName,
      Collection<? extends GrantedAuthority> authorities) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.authorities = authorities;
  }

  public static UserDetailsImpl build(User user) {
    List<GrantedAuthority> grantedAuthorities =
        user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority(role.getRoleName().name()))
            .collect(Collectors.toList());

    return new UserDetailsImpl(
        user.getId(),
        user.getUsername(),
        user.getPassword(),
        user.getEmail(),
        user.getFirstName(),
        user.getLastName(),
        grantedAuthorities);
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  @Override
  public @Nullable String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return username;
  }

  @Override
  public boolean isAccountNonExpired() {
    return UserDetails.super.isAccountNonExpired();
  }

  @Override
  public boolean isAccountNonLocked() {
    return UserDetails.super.isAccountNonLocked();
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return UserDetails.super.isCredentialsNonExpired();
  }

  @Override
  public boolean isEnabled() {
    return UserDetails.super.isEnabled();
  }

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) return false;
    UserDetailsImpl that = (UserDetailsImpl) o;
    return Objects.equals(id, that.id)
        && Objects.equals(username, that.username)
        && Objects.equals(password, that.password)
        && Objects.equals(email, that.email)
        && Objects.equals(firstName, that.firstName)
        && Objects.equals(lastName, that.lastName)
        && Objects.equals(authorities, that.authorities);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, username, password, email, firstName, lastName, authorities);
  }
}
