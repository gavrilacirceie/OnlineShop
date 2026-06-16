package org.platforma.onlineshop.repositories;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Optional;
import org.platforma.onlineshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  Boolean existsByUsername(@NotBlank @Size(min = 3, max = 20) String username);

  Boolean existsByEmail(@NotBlank @Size(min = 3, max = 20) String email);
}
