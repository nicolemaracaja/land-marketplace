package com.example.demo.services.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dtos.auth.AuthRequest;
import com.example.demo.dtos.auth.AuthResponse;
import com.example.demo.dtos.user.UserRequest;
import com.example.demo.dtos.auth.AuthResult;
import com.example.demo.exceptions.BusinessException;
import com.example.demo.models.entities.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.AuthService;
import com.example.demo.services.TokenService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            TokenService tokenService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Override
    public AuthResult login(AuthRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new BusinessException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.password(),
                user.getPasswordHash())) {

            throw new BusinessException("Invalid email or password");
        }

        String token = tokenService.generateToken(user);

        return new AuthResult(user, token);
    }

    @Override
    public AuthResult register(UserRequest request) {

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new BusinessException("Email already registered");
        }

        User user = new User();

        user.setName(request.name());
        user.setEmail(request.email());
        user.setPasswordHash(
                passwordEncoder.encode(request.password())
        );

        User savedUser = userRepository.save(user);
        String token = tokenService.generateToken(savedUser);

        return new AuthResult(savedUser, token);
    }
}