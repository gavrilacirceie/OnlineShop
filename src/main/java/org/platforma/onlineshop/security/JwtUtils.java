package org.platforma.onlineshop.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Date;
import javax.crypto.SecretKey;
import org.platforma.onlineshop.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

@Component
public class JwtUtils {
  private static final Logger log = LoggerFactory.getLogger(JwtUtils.class);

  @Value("${spring.app.jwtExpirationMs}")
  private long jwtExpirationInMs;

  @Value("${spring.app.jwtSecret}")
  private String jwtSecret;

  @Value("${spring.app.jwtcookie}")
  private String jwtCookie;

  // Getting JWT From header
  //  public String getJwtFromHeader(HttpServletRequest request) {
  //    String bearerToken = request.getHeader("Authorization");
  //    log.info("Bearer Token: {}", bearerToken);
  //    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
  //      return bearerToken.substring(7);
  //    }
  //    return null;
  //  }

  public String getJwtFromCookie(HttpServletRequest request) {
    Cookie cookie = WebUtils.getCookie(request, jwtCookie);
    if (cookie != null) {
      return cookie.getValue();
    }
    return null;
  }

  public ResponseCookie getResponseCookie(UserDetailsImpl userDetails) {
    String jwt = generateTokenFromUsername(userDetails.getUsername());
    ResponseCookie cookie =
        ResponseCookie.from(jwtCookie, jwt)
            .path("/api")
            .maxAge(24 * 60 * 60)
            .httpOnly(false)
            .build();
    return cookie;
  }

  public ResponseCookie cleanJwtCookie() {
    ResponseCookie cookie = ResponseCookie.from(jwtCookie, null).path("/api").build();
    return cookie;
  }

  // Generating token from username
  public String generateTokenFromUsername(String user) {
    return Jwts.builder()
        .subject(user)
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
        .signWith(key())
        .compact();
  }

  // getting username from jwt token
  public String getUsernameFromToken(String token) {
    return Jwts.parser()
        .verifyWith((SecretKey) key())
        .build()
        .parseSignedClaims(token)
        .getPayload()
        .getSubject();
  }

  // generate signing key
  public Key key() {
    return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
  }

  // validate jwt token
  public boolean validateToken(String token) {
    try {
      System.out.println("Validating Token");
      Jwts.parser().verifyWith((SecretKey) key()).build().parseSignedClaims(token);
      return true;
    } catch (MalformedJwtException e) {
      log.error("Invalid Token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      log.error("Expired Token: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      log.error("Unsupported Token: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      log.error("JWT claims that string is empty: {}", e.getMessage());
    }
    return false;
  }
}
