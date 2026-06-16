package org.platforma.onlineshop.service;

import java.util.*;
import java.util.stream.Collectors;
import org.platforma.onlineshop.model.Category;
import org.platforma.onlineshop.repositories.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class ChatService {

  private static final Logger log = LoggerFactory.getLogger(ChatService.class);

  @Value("${groq.api.key}")
  private String apiKey;

  @Autowired private CategoryRepository categoryRepository;

  private static final String OPENAI_URL = "https://api.groq.com/openai/v1/chat/completions";

  private final RestTemplate restTemplate = new RestTemplate();

  public String getReply(String userMessage) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(apiKey);

    Map<String, Object> message = new HashMap<>();
    message.put("role", "user");
    message.put("content", userMessage);

    // Fetch real categories from DB
    List<Category> categories = categoryRepository.findAll();
    String categoryList =
        categories.isEmpty()
            ? "No categories available yet."
            : categories.stream()
                .map(c -> "- " + c.getCategoryName())
                .collect(Collectors.joining("\n"));

    Map<String, Object> systemMessage = new HashMap<>();
    systemMessage.put("role", "system");
    systemMessage.put(
        "content",
        "You are a helpful customer support assistant for an online shop. "
            + "Help customers with questions about orders, products, shipping, and returns. "
            + "Be friendly, concise and professional.\n\n"
            + "Here are the product categories currently available in our shop:\n"
            + categoryList
            + "\n\n"
            + "If a customer asks about a category, check the list above and answer accordingly. "
            + "If the category is not in the list, let them know we don't carry it.");

    Map<String, Object> body = new HashMap<>();
    body.put("model", "llama-3.3-70b-versatile");
    body.put("messages", List.of(systemMessage, message));
    body.put("max_tokens", 300);

    HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

    try {
      ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_URL, request, Map.class);
      List<Map<String, Object>> choices =
          (List<Map<String, Object>>) response.getBody().get("choices");
      Map<String, Object> firstChoice = choices.get(0);
      Map<String, String> msg = (Map<String, String>) firstChoice.get("message");
      return msg.get("content");
    } catch (HttpClientErrorException e) {
      log.error(
          "OpenAI API error - Status: {}, Body: {}",
          e.getStatusCode(),
          e.getResponseBodyAsString());
      return "Sorry, I'm currently unavailable. Please try again later.";
    } catch (Exception e) {
      log.error("Unexpected error calling OpenAI: {}", e.getMessage(), e);
      return "Sorry, I'm currently unavailable. Please try again later.";
    }
  }
}
