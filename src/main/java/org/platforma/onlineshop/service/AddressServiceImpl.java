package org.platforma.onlineshop.service;

import java.util.List;
import org.modelmapper.ModelMapper;
import org.platforma.onlineshop.exceptions.APIException;
import org.platforma.onlineshop.model.Address;
import org.platforma.onlineshop.model.User;
import org.platforma.onlineshop.payload.AddressDTO;
import org.platforma.onlineshop.repositories.AddressRepository;
import org.platforma.onlineshop.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddressServiceImpl implements AddressService {
  @Autowired ModelMapper modelMapper;

  @Autowired AddressRepository addressRepository;

  @Autowired AuthUtil authUtil;

  @Override
  public AddressDTO createAddress(AddressDTO addressDTO, User user) {
    Address address = modelMapper.map(addressDTO, Address.class);
    List<Address> addressList = user.getAddresses();
    addressList.add(address);
    user.setAddresses(addressList);

    address.setUser(user);
    Address savedAddress = addressRepository.save(address);

    return modelMapper.map(savedAddress, AddressDTO.class);
  }

  @Override
  public List<AddressDTO> getAllAddresses() {
    List<Address> addresses = addressRepository.findAll();
    if (addresses.isEmpty()) {
      throw new APIException("No address found");
    }
    List<AddressDTO> addressDTOS =
        addresses.stream().map(address -> modelMapper.map(address, AddressDTO.class)).toList();
    return addressDTOS;
  }

  @Override
  public AddressDTO getSpecificAddress(Long addressId) {
    Address address =
        addressRepository
            .findById(addressId)
            .orElseThrow(() -> new APIException("Address not found"));
    return modelMapper.map(address, AddressDTO.class);
  }

  @Override
  public List<AddressDTO> getSpecificAddressByUser() {
    User user = authUtil.loggedInUser();
    List<Address> addresses = addressRepository.findAddressesByUser(user);
    if (addresses.isEmpty()) {
      throw new APIException("No address found");
    }
    return addresses.stream().map(address -> modelMapper.map(address, AddressDTO.class)).toList();
  }

  @Override
  public AddressDTO updateAddress(AddressDTO addressDTO, Long addressId) {
    Address addressFromDb =
        addressRepository
            .findById(addressId)
            .orElseThrow(() -> new APIException("Address not found"));
    Address address = modelMapper.map(addressDTO, Address.class);

    addressFromDb.setCity(address.getCity());
    addressFromDb.setCountry(address.getCountry());
    addressFromDb.setStreet(address.getStreet());
    addressFromDb.setPincode(address.getPincode());
    addressFromDb.setBuildingName(address.getBuildingName());
    addressFromDb.setState(address.getState());

    Address updatedAddress = addressRepository.save(addressFromDb);

    return modelMapper.map(updatedAddress, AddressDTO.class);
  }

  @Override
  public String deleteAddressFromUser(Long addressId) {
    User user = authUtil.loggedInUser();
    Address address = addressRepository.findAddressByIdAndUser(addressId, user);
    if (address == null) {
      throw new APIException("Address not found");
    }

    addressRepository.deleteById(addressId);
    return "Address deleted";
  }
}
