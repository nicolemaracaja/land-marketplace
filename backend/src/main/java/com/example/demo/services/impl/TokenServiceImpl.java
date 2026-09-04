package com.example.demo.services.impl;

import javax.crypto.SecretKey;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.demo.models.entities.User;
import com.example.demo.services.TokenService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class TokenServiceImpl implements TokenService {

    private final SecretKey signingKey;
    private final long expirationTime;

    public TokenServiceImpl(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expirationTime) {

        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationTime = expirationTime;
    }

    @Override
    public String generateToken(User user) {
        Date now = new Date();
        Date expiration = new Date(
                now.getTime() + expirationTime);

        return Jwts.builder()
                .subject(user.getId().toString())
                .issuedAt(now)
                .expiration(expiration)
                .signWith(signingKey)
                .compact();
    }

    @Override
    public Long getUserId(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return Long.valueOf(claims.getSubject());
    }
}
