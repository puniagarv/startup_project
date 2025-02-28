package com.intern.project.startup.jwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtVerificationHelper {

    private static final long VERIFICATION_TOKEN_VALIDITY = 15 * 60 * 1000; // 15 minutes

    private String secret = "JJJJJJJJJJJJJJJJJAAAAAAAAAAAAAAANNNNNNNNNNNNNNNNNNNNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVIIIIIIIII"; // Secure the key in application.properties

    // Generate JWT for email verification
    public String generateVerificationToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + VERIFICATION_TOKEN_VALIDITY))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    // Extract email from token
    public String getEmailFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    // Validate token (without passing email separately)
    public Boolean validateVerificationToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token); // Throws an error if token is invalid
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false; // Invalid or expired token
        }
    }

    // Check if the token is expired
    private Boolean isTokenExpired(String token) {
        final Date expiration = getClaimFromToken(token, Claims::getExpiration);
        return expiration.before(new Date());
    }

    // Retrieve specific claim from token
    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }
}
