package org.platforma.onlineshop.payload;

import lombok.Data;

@Data
public class ChatResponse {
  private String reply;

  public ChatResponse() {}

  public ChatResponse(String reply) {
    this.reply = reply;
  }
}
