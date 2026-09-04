package com.example.demo.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;

import java.util.UUID;

import com.example.demo.repositories.LandRepository;
import com.example.demo.repositories.NegotiationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.models.entities.User;
import com.example.demo.repositories.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("Tests for Auth Controller")
class AuthControllerTest {

    private static final String URI = "/api/auth";

    @Autowired
    MockMvc driver;

    @Autowired
    UserRepository userRepository;

    @Autowired
    NegotiationRepository negotiationRepository;

    @Autowired
    LandRepository landRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @BeforeEach
    void setup() {
        negotiationRepository.deleteAll();
        landRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Registers user successfully")
    void registerSuccessfully() throws Exception {
        String email = uniqueEmail();

        String json = """
                {
                    "name": "User Test",
                    "email": "%s",
                    "password": "password123"
                }
                """.formatted(email);

        driver.perform(post(URI + "/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("User Test"))
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(header().string(
                        "Set-Cookie", 
                        org.hamcrest.Matchers.containsString("token=")));
    }

    @Test
    @DisplayName("Registering invalid user returns 400")
    void registerInvalidData() throws Exception {
        String json = """
                {
                    "name": "",
                    "email": "invalid-email",
                    "password": ""
                }
                """;

        driver.perform(post(URI + "/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Registering existing email returns 409")
    void registerExistingEmail() throws Exception {
        String email = uniqueEmail();

        User user = new User();
        user.setName("Existing User");
        user.setEmail(email);
        user.setPasswordHash(
                passwordEncoder.encode("password123"));

        userRepository.save(user);

        String json = """
                {
                    "name": "New User",
                    "email": "%s",
                    "password": "password123"
                }
                """.formatted(email);

        driver.perform(post(URI + "/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Logs in successfully")
    void loginSuccessfully() throws Exception {
        String email = uniqueEmail();
        String password = "password123";

        User user = new User();
        user.setName("User Test");
        user.setEmail(email);
        user.setPasswordHash(
                passwordEncoder.encode(password));

        User savedUser = userRepository.save(user);

        String json = """
                {
                    "email": "%s",
                    "password": "%s"
                }
                """.formatted(email, password);

        driver.perform(post(URI + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedUser.getId()))
                .andExpect(jsonPath("$.name").value("User Test"))
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(header().string(
                        "Set-Cookie",
                        org.hamcrest.Matchers.containsString("token=")));
    }

    @Test
    @DisplayName("Login with incorrect password returns 409")
    void loginIncorrectPassword() throws Exception {
        String email = uniqueEmail();

        User user = new User();
        user.setName("User Test");
        user.setEmail(email);
        user.setPasswordHash(
                passwordEncoder.encode("correctPassword"));

        userRepository.save(user);

        String json = """
                {
                    "email": "%s",
                    "password": "wrongPassword"
                }
                """.formatted(email);

        driver.perform(post(URI + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Login with nonexistent email returns 409")
    void loginNonexistentEmail() throws Exception {
        String json = """
                {
                    "email": "%s",
                    "password": "password123"
                }
                """.formatted(uniqueEmail());

        driver.perform(post(URI + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isConflict());
    }

    private String uniqueEmail() {
        return "test-" + UUID.randomUUID() + "@example.com";
    }
}