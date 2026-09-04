package com.example.demo.controllers;

import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dtos.auth.AuthRequest;
import com.example.demo.dtos.auth.AuthResponse;
import com.example.demo.dtos.auth.AuthResult;
import com.example.demo.dtos.user.UserRequest;
import com.example.demo.dtos.user.UserResponse;
import com.example.demo.services.AuthService;
import com.example.demo.models.entities.User;

import org.springframework.security.core.context.SecurityContextHolder;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        UserResponse response = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody @Valid AuthRequest request) {

        AuthResult result = authService.login(request);

        ResponseCookie cookie = ResponseCookie.from("token", result.token())
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(24 * 60 * 60)
                .build();

        AuthResponse response = new AuthResponse(
            result.user().getId(),
            result.user().getEmail(),
            result.user().getName()
        );

        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody @Valid UserRequest request) {

        AuthResult result = authService.register(request);

        ResponseCookie cookie = ResponseCookie.from("token", result.token())
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(24 * 60 * 60)
                .build();

        AuthResponse response = new AuthResponse(
            result.user().getId(),
            result.user().getEmail(),
            result.user().getName()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header("Set-Cookie", cookie.toString())
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.noContent()
                .header("Set-Cookie", cookie.toString())
                .build();
    }
}
