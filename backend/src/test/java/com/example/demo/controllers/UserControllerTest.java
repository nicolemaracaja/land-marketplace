package com.example.demo.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.models.entities.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.TokenService;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("Tests for User Controller")
class UserControllerTest {

    private static final String URI = "/api/users";

    @Autowired
    MockMvc driver;

    @Autowired
    UserRepository userRepository;

    @Autowired
    LandRepository landRepository;

    @Autowired
    NegotiationRepository negotiationRepository;

    @Autowired
    TokenService tokenService;

    private String token;

    @BeforeEach
    void setup() {
        negotiationRepository.deleteAll();
        landRepository.deleteAll();
        userRepository.deleteAll();

        User user = new User(
                null,
                "Test User",
                "test-" + UUID.randomUUID() + "@example.com",
                "password123",
                null,
                null);

        User savedUser = userRepository.save(user);

        token = tokenService.generateToken(savedUser);
    }

    @Test
    @DisplayName("Finds user by ID successfully")
    void findByIdSuccessfully() throws Exception {
        var user = createUser("User Test");
        Long id = user.getId();

        driver.perform(get(URI + "/{id}", id)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.name").value("User Test"))
                .andExpect(jsonPath("$.email").value(user.getEmail()));
    }

    @Test
    @DisplayName("Finding nonexistent user returns 404")
    void findByIdNotFound() throws Exception {
        driver.perform(get(URI + "/999999")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Lists users successfully")
    void findAllSuccessfully() throws Exception {
        createUser("User One");
        createUser("User Two");

        driver.perform(get(URI)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    @DisplayName("Updates user successfully")
    void updateSuccessfully() throws Exception {
        var user = createUser("User Test");
        Long id = user.getId();

        String updateJson = """
                {
                    "name": "Updated User",
                    "email": "%s",
                    "password": "newPassword"
                }
                """.formatted(uniqueEmail());

        driver.perform(put(URI + "/{id}", id)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.name").value("Updated User"));
    }

    @Test
    @DisplayName("Updating nonexistent user returns 404")
    void updateNotFound() throws Exception {
        String json = """
                {
                    "name": "Updated User",
                    "email": "%s",
                    "password": "password123"
                }
                """.formatted(uniqueEmail());

        driver.perform(put(URI + "/999999")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Deletes user successfully")
    void deleteSuccessfully() throws Exception {
        var user = createUser("User Test");
        Long id = user.getId();

        driver.perform(delete(URI + "/{id}", id)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        driver.perform(get(URI + "/{id}", id)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Deleting nonexistent user returns 404")
    void deleteNotFound() throws Exception {
        driver.perform(delete(URI + "/999999")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    private User createUser(String name) {
        return userRepository.save(
                new User(
                        null,
                        name,
                        uniqueEmail(),
                        "password123",
                        null,
                        null));
    }

    private String uniqueEmail() {
        return "test-" + UUID.randomUUID() + "@example.com";
    }
}