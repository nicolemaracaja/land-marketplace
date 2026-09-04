package com.example.demo.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.UUID;

import com.example.demo.repositories.LandRepository;
import com.example.demo.repositories.NegotiationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dtos.auth.AuthRequest;
import com.example.demo.dtos.auth.AuthResult;
import com.example.demo.dtos.user.UserRequest;
import com.example.demo.exceptions.BusinessException;
import com.example.demo.models.entities.User;
import com.example.demo.repositories.UserRepository;

@SpringBootTest
@Transactional
@DisplayName("Tests for Auth Service")
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private NegotiationRepository negotiationRepository;

    @Autowired
    private LandRepository landRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setup() {
        negotiationRepository.deleteAll();
        landRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Registers user successfully")
    void registerSuccessfully() {

        UserRequest request = new UserRequest(
                "User Test",
                uniqueEmail(),
                "password123"
        );

        AuthResult result = authService.register(request);

        assertThat(result.user().getId()).isNotNull();
        assertThat(result.user().getName()).isEqualTo("User Test");
        assertThat(result.user().getEmail()).isEqualTo(request.email());
        assertThat(result.token()).isNotBlank();

        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("Stores user password encrypted")
    void registerEncryptsPassword() {

        String rawPassword = "password123";
        String email = uniqueEmail();

        UserRequest request = new UserRequest(
                "User Test",
                email,
                rawPassword
        );

        authService.register(request);

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        assertThat(user.getPasswordHash())
                .isNotEqualTo(rawPassword);

        assertThat(passwordEncoder.matches(
                rawPassword,
                user.getPasswordHash()
        )).isTrue();
    }

    @Test
    @DisplayName("Throws exception when email is already registered")
    void registerWithExistingEmail() {

        String email = uniqueEmail();

        User existingUser = new User();
        existingUser.setName("Existing User");
        existingUser.setEmail(email);
        existingUser.setPasswordHash(
                passwordEncoder.encode("password123")
        );

        userRepository.save(existingUser);

        UserRequest request = new UserRequest(
                "New User",
                email,
                "password123"
        );

        assertThatThrownBy(() ->
                authService.register(request)
        )
        .isInstanceOf(BusinessException.class);

        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("Logs in successfully with valid credentials")
    void loginSuccessfully() {

        String email = uniqueEmail();
        String password = "password123";

        User user = new User();
        user.setName("User Test");
        user.setEmail(email);
        user.setPasswordHash(
                passwordEncoder.encode(password)
        );

        User savedUser = userRepository.save(user);

        AuthRequest request = new AuthRequest(
                email,
                password
        );

        AuthResult result = authService.login(request);

        assertThat(result.user().getId()).isEqualTo(savedUser.getId());
        assertThat(result.user().getEmail()).isEqualTo(email);
        assertThat(result.user().getName()).isEqualTo("User Test");
        assertThat(result.token()).isNotBlank();
    }

    @Test
    @DisplayName("Throws exception when password is incorrect")
    void loginWithIncorrectPassword() {

        String email = uniqueEmail();

        User user = new User();
        user.setName("User Test");
        user.setEmail(email);
        user.setPasswordHash(
                passwordEncoder.encode("correctPassword")
        );

        userRepository.save(user);

        AuthRequest request = new AuthRequest(
                email,
                "wrongPassword"
        );

        assertThatThrownBy(() ->
                authService.login(request)
        )
        .isInstanceOf(BusinessException.class);
    }

    @Test
    @DisplayName("Throws exception when email does not exist")
    void loginWithNonexistentEmail() {

        AuthRequest request = new AuthRequest(
                uniqueEmail(),
                "password123"
        );

        assertThatThrownBy(() ->
                authService.login(request)
        )
        .isInstanceOf(BusinessException.class);
    }

    private String uniqueEmail() {
        return "test-" + UUID.randomUUID() + "@example.com";
    }
}

