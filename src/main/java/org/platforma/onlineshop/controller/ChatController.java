package org.platforma.onlineshop.controller;

import org.platforma.onlineshop.payload.ChatRequest;
import org.platforma.onlineshop.payload.ChatResponse;
import org.platforma.onlineshop.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

  @Autowired private ChatService chatService;

  @PostMapping
  public ChatResponse chat(@RequestBody ChatRequest request) {
    String reply = chatService.getReply(request.getMessage());
    return new ChatResponse(reply);
  }
}
