package com.example.demo.services;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.demo.models.entities.User;

@SpringBootTest
class TokenServiceTest {

    @Autowired
    private TokenService tokenService;

    @Test
    void generateAndReadTokenSuccessfully() {
        User user = new User();
        user.setId(1L);
        user.setName("User Test");
        user.setEmail("user@example.com");

        String token = tokenService.generateToken(user);

        assertNotNull(token);
        assertFalse(token.isBlank());

        Long userId = tokenService.getUserId(token);

        assertEquals(1L, userId);
    }

    @Test
    void invalidTokenIsRejected() {
        User user = new User();
        user.setId(1L);
        user.setName("User Test");
        user.setEmail("user@example.com");

        String token = tokenService.generateToken(user);
        String invalidToken = token + "invalid";

        assertThrows(
                Exception.class,
                () -> tokenService.getUserId(invalidToken));
    }
}