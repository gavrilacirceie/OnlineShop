package org.platforma.onlineshop.repositories;

import java.util.List;
import org.platforma.onlineshop.model.Address;
import org.platforma.onlineshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
  List<Address> findAddressesByUser(User user);

  Address findAddressByIdAndUser(Long addressId, User user);
}
