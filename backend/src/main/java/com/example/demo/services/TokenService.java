package com.example.demo.services;

import com.example.demo.models.entities.User;

public interface TokenService {
    String generateToken(User user);

    Long getUserId(String token);
}
