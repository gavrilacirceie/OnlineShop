package org.platforma.onlineshop.repositories;

import java.util.Optional;
import org.platforma.onlineshop.model.AppRole;
import org.platforma.onlineshop.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

  Optional<Role> findByRoleName(AppRole appRole);
}
