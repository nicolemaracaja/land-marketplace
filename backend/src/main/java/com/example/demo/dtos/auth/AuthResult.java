package com.example.demo.dtos.auth;

import com.example.demo.models.entities.User;

public record AuthResult(
        User user,
        String token
) {}