package org.platforma.onlineshop.security;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageResponse {
  private String message;

  public MessageResponse(String usernameAlreadyExists) {
    message = usernameAlreadyExists;
  }
}
