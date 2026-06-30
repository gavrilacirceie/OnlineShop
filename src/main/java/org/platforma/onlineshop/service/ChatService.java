package org.platforma.onlineshop.service;

import java.util.*;
import java.util.stream.Collectors;
import org.platforma.onlineshop.model.*;
import org.platforma.onlineshop.repositories.CategoryRepository;
import org.platforma.onlineshop.repositories.OrderRepository;
import org.platforma.onlineshop.repositories.ProductRepository;
import org.platforma.onlineshop.util.AuthUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class ChatService {

  private static final Logger log = LoggerFactory.getLogger(ChatService.class);
  private static final String DEFAULT_GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

  @Value("${groq.api.key}")
  private String apiKey;

  @Value("${groq.api.url:" + DEFAULT_GROQ_URL + "}")
  private String groqUrl;

  @Autowired private ProductRepository productRepository;

  @Autowired private OrderRepository orderRepository;

  @Autowired private CategoryRepository categoryRepository;

  private final RestTemplate restTemplate = new RestTemplate();
  @Autowired private AuthUtil authUtil;

  private User getAuthUser() {
    return authUtil.loggedInUser();
  }

  public String getReply(String userMessage) {
    if (apiKey == null || apiKey.isBlank()) {
      log.error("Groq API key is missing. Please set GROQ_SECRET_KEY.");
      return "Sorry, chat is unavailable right now.";
    }

    try {
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);
      headers.setBearerAuth(apiKey);

      Map<String, Object> message = new HashMap<>();
      message.put("role", "user");
      message.put("content", userMessage);

      String categoryList = buildCategoryList();
      String productList = buildProductList();
      String orderList = buildOrderList();

      Map<String, Object> systemMessage = new HashMap<>();
      systemMessage.put("role", "system");
      systemMessage.put(
          "content",
          "You are a helpful customer support assistant for an online shop. "
              + "Help customers with questions about orders, products, shipping, and returns. "
              + "Be friendly, concise and professional.\n\n"
              + "Here are the product categories currently available in our shop:\n"
              + categoryList
              + "\n\nHere are the available products:\n"
              + productList
              + "\n\nHere are the current user's orders:\n"
              + orderList
              + "\n\nIf a customer asks about a category, check the list above and answer accordingly. "
              + "If the category is not in the list, let them know we don't carry it.");

      Map<String, Object> body = new HashMap<>();
      body.put("model", "llama-3.3-70b-versatile");
      body.put("messages", List.of(systemMessage, message));
      body.put("max_tokens", 300);

      HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
      ResponseEntity<Map> response = restTemplate.postForEntity(groqUrl, request, Map.class);
      List<Map<String, Object>> choices =
          (List<Map<String, Object>>) response.getBody().get("choices");
      Map<String, Object> firstChoice = choices.get(0);
      Map<String, String> msg = (Map<String, String>) firstChoice.get("message");
      return msg.get("content");
    } catch (HttpClientErrorException e) {
      log.error(
          "Groq API error - Status: {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
      return "Sorry, I'm currently unavailable. Please try again later.";
    } catch (Exception e) {
      log.error("Unexpected error calling Groq: {}", e.getMessage(), e);
      return "Sorry, I'm currently unavailable. Please try again later.";
    }
  }

  private String buildCategoryList() {
    List<Category> categories = categoryRepository.findAll();
    return categories.isEmpty()
        ? "No categories available yet."
        : categories.stream()
            .map(c -> "- " + c.getCategoryName())
            .collect(Collectors.joining("\n"));
  }

  private String buildProductList() {
    List<Product> products = productRepository.findAll();
    return products.isEmpty()
        ? "No products available yet."
        : products.stream().map(p -> "- " + p.getProductName()).collect(Collectors.joining("\n"));
  }

  private String buildOrderList() {
    try {
      User user = getAuthUser();
      Page<Order> orders = orderRepository.findByEmail(user.getEmail(), Pageable.unpaged());
      return orders.isEmpty()
          ? "No orders available yet."
          : orders.stream()
              .map(
                  order ->
                      String.format(
                          "- Order #%d on %s with status %s",
                          order.getId(), order.getDate(), order.getOrderStatus()))
              .collect(Collectors.joining("\n"));
    } catch (Exception e) {
      log.warn("Unable to load current user orders for chat context: {}", e.getMessage());
      return "Current user orders are unavailable.";
    }
  }
}
