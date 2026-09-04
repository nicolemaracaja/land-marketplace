package com.example.demo.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.UUID;

import com.example.demo.repositories.LandRepository;
import com.example.demo.repositories.NegotiationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dtos.user.UserRequest;
import com.example.demo.dtos.user.UserResponse;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.entities.User;
import com.example.demo.repositories.UserRepository;

@SpringBootTest
@Transactional
@DisplayName("Tests for User Service")
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LandRepository landRepository;

    @Autowired
    private NegotiationRepository negotiationRepository;

    @BeforeEach
    void setup() {
        negotiationRepository.deleteAll();
        landRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Finds user by id successfully")
    void findByIdSuccessfully() {

        User user = new User();
        user.setName("User Test");
        user.setEmail(uniqueEmail());
        user.setPasswordHash("password");

        User savedUser = userRepository.save(user);

        UserResponse found = userService.findById(savedUser.getId());

        assertThat(found.id()).isEqualTo(savedUser.getId());
        assertThat(found.name()).isEqualTo("User Test");
        assertThat(found.email()).isEqualTo(savedUser.getEmail());
    }

    @Test
    @DisplayName("Throws exception when user does not exist")
    void findByIdNotFound() {

        assertThatThrownBy(() -> userService.findById(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Finds all users successfully")
    void findAllSuccessfully() {

        User userOne = new User();
        userOne.setName("User One");
        userOne.setEmail(uniqueEmail());
        userOne.setPasswordHash("password");

        User userTwo = new User();
        userTwo.setName("User Two");
        userTwo.setEmail(uniqueEmail());
        userTwo.setPasswordHash("password");

        User savedUserOne = userRepository.save(userOne);
        User savedUserTwo = userRepository.save(userTwo);

        List<UserResponse> result = userService.findAll();

        assertThat(result).hasSize(2);

        assertThat(result)
                .extracting(UserResponse::email)
                .containsExactlyInAnyOrder(
                        savedUserOne.getEmail(),
                        savedUserTwo.getEmail());
    }

    @Test
    @DisplayName("Updates user successfully")
    void updateSuccessfully() {

        User user = new User();
        user.setName("User Test");
        user.setEmail(uniqueEmail());
        user.setPasswordHash("password");

        User savedUser = userRepository.save(user);

        UserRequest update = new UserRequest(
                "Updated User",
                uniqueEmail(),
                "newPassword");

        UserResponse updated = userService.update(savedUser.getId(), update);

        assertThat(updated.id()).isEqualTo(savedUser.getId());
        assertThat(updated.name()).isEqualTo("Updated User");
        assertThat(updated.email()).isEqualTo(update.email());
    }

    @Test
    @DisplayName("Throws exception when updating nonexistent user")
    void updateNotFound() {

        UserRequest request = new UserRequest(
                "Updated User",
                uniqueEmail(),
                "password");

        assertThatThrownBy(() -> userService.update(999L, request))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Deletes user successfully")
    void deleteSuccessfully() {

        User user = new User();
        user.setName("User Test");
        user.setEmail(uniqueEmail());
        user.setPasswordHash("password");

        User savedUser = userRepository.save(user);

        userService.delete(savedUser.getId());

        assertThat(userRepository.findById(savedUser.getId()))
                .isEmpty();
    }

    @Test
    @DisplayName("Throws exception when deleting nonexistent user")
    void deleteNotFound() {

        assertThatThrownBy(() -> userService.delete(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    private String uniqueEmail() {
        return "test-" + UUID.randomUUID() + "@example.com";
    }
}