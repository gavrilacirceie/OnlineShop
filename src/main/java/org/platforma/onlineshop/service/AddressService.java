package org.platforma.onlineshop.service;

import java.util.List;
import org.platforma.onlineshop.model.User;
import org.platforma.onlineshop.payload.AddressDTO;

public interface AddressService {
  AddressDTO createAddress(AddressDTO addressDTO, User user);

  List<AddressDTO> getAllAddresses();

  AddressDTO getSpecificAddress(Long addressId);

  List<AddressDTO> getSpecificAddressByUser();

  AddressDTO updateAddress(AddressDTO addressDTO, Long addressId);

  String deleteAddressFromUser(Long addressId);
}
