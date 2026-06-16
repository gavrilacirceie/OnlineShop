package org.platforma.onlineshop.exceptions;

import java.util.HashMap;
import java.util.Map;
import org.platforma.onlineshop.payload.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class MyGlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> myMethodArgumentNotValidException(
      MethodArgumentNotValidException e) {
    Map<String, String> responses = new HashMap<>();
    e.getBindingResult()
        .getAllErrors()
        .forEach(
            (error) -> {
              String fieldName = ((FieldError) error).getField();
              String message = ((FieldError) error).getDefaultMessage();
              responses.put(fieldName, message);
            });
    return new ResponseEntity<Map<String, String>>(responses, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<APIResponse> myResourceNotFoundException(ResourceNotFoundException e) {
    String message = e.getMessage();
    APIResponse response = new APIResponse(message, false);
    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(APIException.class)
  public ResponseEntity<APIResponse> myResourceNotFoundException(APIException e) {
    String message = e.getMessage();
    APIResponse response = new APIResponse(message, false);
    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
  }
}
