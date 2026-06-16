package org.platforma.onlineshop.controller;

import java.util.List;
import org.platforma.onlineshop.model.User;
import org.platforma.onlineshop.payload.AddressDTO;
import org.platforma.onlineshop.service.AddressService;
import org.platforma.onlineshop.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AddressController {
  @Autowired private AddressService addressService;
  @Autowired private AuthUtil authUtil;

  @PostMapping("/addresses")
  public ResponseEntity<AddressDTO> createAddress(@RequestBody AddressDTO addressDTO) {
    User user = authUtil.loggedInUser();
    AddressDTO saveAddressDTO = addressService.createAddress(addressDTO, user);
    return new ResponseEntity<>(saveAddressDTO, HttpStatus.CREATED);
  }

  @GetMapping("/addresses")
  public ResponseEntity<List<AddressDTO>> getAddress() {
    List<AddressDTO> addressDTOS = addressService.getAllAddresses();
    return new ResponseEntity<>(addressDTOS, HttpStatus.OK);
  }

  @GetMapping("/addresses/{addressId}")
  public ResponseEntity<AddressDTO> getAddress(@PathVariable Long addressId) {
    AddressDTO addressDTO = addressService.getSpecificAddress(addressId);
    return new ResponseEntity<>(addressDTO, HttpStatus.OK);
  }

  @GetMapping("/addresses/user")
  public ResponseEntity<List<AddressDTO>> getAddressByUser() {
    List<AddressDTO> addressDTOS = addressService.getSpecificAddressByUser();
    return new ResponseEntity<>(addressDTOS, HttpStatus.OK);
  }

  @PutMapping("/addresses/{addressId}")
  public ResponseEntity<AddressDTO> updateAddress(
      @PathVariable Long addressId, @RequestBody AddressDTO addressDTO) {
    AddressDTO updateAddressDTO = addressService.updateAddress(addressDTO, addressId);
    return new ResponseEntity<>(updateAddressDTO, HttpStatus.OK);
  }

  @DeleteMapping("/addresses/{addressId}")
  public ResponseEntity<String> deleteAddress(@PathVariable Long addressId) {
    String status = addressService.deleteAddressFromUser(addressId);
    return new ResponseEntity<>(status, HttpStatus.OK);
  }
}
