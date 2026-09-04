package com.example.demo.dtos.auth;

public record AuthResponse(
    Long id,
    String email,
    String name
) {}
