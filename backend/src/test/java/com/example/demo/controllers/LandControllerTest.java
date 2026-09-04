package com.example.demo.controllers;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import com.example.demo.repositories.LandRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("Tests for Land Controller")
class LandControllerTest {

    private static final String URI = "/api/lands";

    @Autowired
    MockMvc driver;

    @Autowired
    LandRepository landRepository;

    @Autowired
    UserRepository userRepository;

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
    @DisplayName("Creates land successfully")
    void createSuccessfully() throws Exception {

        String json = """
                {
                    "name": "Land One",
                    "description": "Test land",
                    "price": 100000.00,
                    "contact": "contact@example.com",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[0,0],[1,0],[1,1],[0,1],[0,0]]]
                    }
                }
                """;

        driver.perform(post(URI)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("Land One"))
                .andExpect(jsonPath("$.description").value("Test land"))
                .andExpect(jsonPath("$.price").value(100000.00))
                .andExpect(jsonPath("$.contact").value("contact@example.com"))
                .andExpect(jsonPath("$.geometry.type").value("Polygon"));
    }

    @Test
    @DisplayName("Finds land by ID successfully")
    void findByIdSuccessfully() throws Exception {

        createLand(
                "Land One",
                """
                        {
                            "type": "Polygon",
                            "coordinates": [[[0,0],[1,0],[1,1],[0,1],[0,0]]]
                        }
                        """);

        Long id = landRepository.findAll().get(0).getId();

        driver.perform(get(URI + "/{id}", id)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.name").value("Land One"))
                .andExpect(jsonPath("$.geometry.type").value("Polygon"));
    }

    @Test
    @DisplayName("Finding nonexistent land returns 404")
    void findByIdNotFound() throws Exception {

        driver.perform(get(URI + "/999999")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Lists lands successfully")
    void findAllSuccessfully() throws Exception {

        createLand(
                "Land One",
                """
                        {
                            "type": "Polygon",
                            "coordinates": [[[0,0],[1,0],[1,1],[0,1],[0,0]]]
                        }
                        """);

        createLand(
                "Land Two",
                """
                        {
                            "type": "Polygon",
                            "coordinates": [[[2,2],[3,2],[3,3],[2,3],[2,2]]]
                        }
                        """);

        driver.perform(get(URI)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @DisplayName("Updates land successfully")
    void updateSuccessfully() throws Exception {

        createLand(
                "Land One",
                """
                        {
                            "type": "Polygon",
                            "coordinates": [[[0,0],[1,0],[1,1],[0,1],[0,0]]]
                        }
                        """);

        Long id = landRepository.findAll().get(0).getId();

        String json = """
                {
                    "name": "Updated Land",
                    "description": "Updated description",
                    "price": 200000.00,
                    "contact": "updated@example.com",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[2,2],[3,2],[3,3],[2,3],[2,2]]]
                    }
                }
                """;

        driver.perform(put(URI + "/{id}", id)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.name").value("Updated Land"))
                .andExpect(jsonPath("$.description").value("Updated description"))
                .andExpect(jsonPath("$.price").value(200000.00))
                .andExpect(jsonPath("$.contact").value("updated@example.com"));
    }

    @Test
    @DisplayName("Updating nonexistent land returns 404")
    void updateNotFound() throws Exception {

        String json = """
                {
                    "name": "Updated Land",
                    "description": "Updated description",
                    "price": 200000.00,
                    "contact": "updated@example.com",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[2,2],[3,2],[3,3],[2,3],[2,2]]]
                    }
                }
                """;

        driver.perform(put(URI + "/999999")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Deletes land successfully")
    void deleteSuccessfully() throws Exception {

        createLand(
                "Land One",
                """
                        {
                            "type": "Polygon",
                            "coordinates": [[[0,0],[1,0],[1,1],[0,1],[0,0]]]
                        }
                        """);

        Long id = landRepository.findAll().get(0).getId();

        driver.perform(delete(URI + "/{id}", id)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        driver.perform(get(URI + "/{id}", id)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Deleting nonexistent land returns 404")
    void deleteNotFound() throws Exception {

        driver.perform(delete(URI + "/999999")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Creating land with invalid data returns 400")
    void createInvalidData() throws Exception {

        String json = """
                {
                    "name": "",
                    "description": "",
                    "price": 0,
                    "contact": "",
                    "geometry": {}
                }
                """;

        driver.perform(post(URI)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Creating overlapping land returns 409")
    void createOverlappingLand() throws Exception {

        createLand(
                "Land One",
                """
                        {
                            "type": "Polygon",
                            "coordinates": [[[0,0],[1,0],[1,1],[0,1],[0,0]]]
                        }
                        """);

        String json = """
                {
                    "name": "Land Two",
                    "description": "Overlapping land",
                    "price": 150000.00,
                    "contact": "contact2@example.com",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[0.5,0.5],[1.5,0.5],[1.5,1.5],[0.5,1.5],[0.5,0.5]]]
                    }
                }
                """;

        driver.perform(post(URI)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Searches lands within circle successfully")
    void searchWithinCircleSuccessfully() throws Exception {

        createLand(
                "Nearby Land",
                """
                        {
                            "type": "Polygon",
                            "coordinates": [[[-0.01,-0.01],[0.01,-0.01],[0.01,0.01],[-0.01,0.01],[-0.01,-0.01]]]
                        }
                        """);

        createLand(
                "Far Land",
                """
                        {
                            "type": "Polygon",
                            "coordinates": [[[10,10],[11,10],[11,11],[10,11],[10,10]]]
                        }
                        """);

        driver.perform(get(URI + "/search")
                .header("Authorization", "Bearer " + token)
                .param("latitude", "0")
                .param("longitude", "0")
                .param("radiusMeters", "2000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Nearby Land"));
    }

    @Test
    @DisplayName("Search with invalid latitude returns 400")
    void searchInvalidLatitude() throws Exception {

        driver.perform(get(URI + "/search")
                .header("Authorization", "Bearer " + token)
                .param("latitude", "91")
                .param("longitude", "0")
                .param("radiusMeters", "1000"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Search with invalid longitude returns 400")
    void searchInvalidLongitude() throws Exception {

        driver.perform(get(URI + "/search")
                .header("Authorization", "Bearer " + token)
                .param("latitude", "0")
                .param("longitude", "181")
                .param("radiusMeters", "1000"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Search with invalid radius returns 400")
    void searchInvalidRadius() throws Exception {

        driver.perform(get(URI + "/search")
                .header("Authorization", "Bearer " + token)
                .param("latitude", "0")
                .param("longitude", "0")
                .param("radiusMeters", "0"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Rejects unauthenticated request")
    void unauthenticatedRequestIsRejected() throws Exception {
        driver.perform(get(URI))
                .andExpect(status().isUnauthorized());
    }

    private void createLand(String name, String geometry) throws Exception {

        String json = """
                {
                    "name": "%s",
                    "description": "Test land",
                    "price": 100000.00,
                    "contact": "contact@example.com",
                    "geometry": %s
                }
                """.formatted(name, geometry);

        driver.perform(post(URI)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated());
    }
}
