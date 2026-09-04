package com.example.demo.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LinearRing;
import org.locationtech.jts.geom.Polygon;

import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.models.entities.Land;
import com.example.demo.models.entities.Negotiation;
import com.example.demo.models.entities.User;
import com.example.demo.models.enums.NegotiationStatus;
import com.example.demo.repositories.LandRepository;
import com.example.demo.repositories.NegotiationRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.TokenService;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("Tests for Negotiation Controller")
class NegotiationControllerTest {

    private static final String URI = "/api/negotiations";

    @Autowired
    private MockMvc driver;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LandRepository landRepository;

    @Autowired
    private NegotiationRepository negotiationRepository;

    @Autowired
    private TokenService tokenService;

    private User buyer;
    private User seller;
    private Land land;
    private String buyerToken;
    private String sellerToken;

    @BeforeEach
    void setup() {

        negotiationRepository.deleteAll();
        landRepository.deleteAll();
        userRepository.deleteAll();

        seller = createUser("Seller");
        buyer = createUser("Buyer");

        land = new Land();
        land.setName("Test Land");
        land.setDescription("Land for testing");
        land.setPrice(new BigDecimal("100000.00"));
        land.setContact("seller@example.com");
        land.setOwner(seller);
        land.setGeometry(createPolygon());

        land = landRepository.save(land);

        buyerToken = tokenService.generateToken(buyer);
        sellerToken = tokenService.generateToken(seller);
    }

    @Test
    @DisplayName("Creates negotiation successfully")
    void createSuccessfully() throws Exception {

        String json = """
                {
                    "landId": %d,
                    "offer": 90000.00
                }
                """.formatted(land.getId());

        driver.perform(post(URI)
                        .header("Authorization", "Bearer " + buyerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.landName").value("Test Land"))
                .andExpect(jsonPath("$.landPrice").value(100000.00))
                .andExpect(jsonPath("$.offer").value(90000.00))
                .andExpect(jsonPath("$.person").value("Seller"))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.type").value("sent"));
    }

    @Test
    @DisplayName("Creating negotiation for nonexistent land returns 404")
    void createLandNotFound() throws Exception {

        String json = """
                {
                    "landId": 999999,
                    "offer": 90000.00
                }
                """;

        driver.perform(post(URI)
                        .header("Authorization", "Bearer " + buyerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Creating negotiation with invalid offer returns 400")
    void createInvalidOffer() throws Exception {

        String json = """
                {
                    "landId": %d,
                    "offer": 0
                }
                """.formatted(land.getId());

        driver.perform(post(URI)
                        .header("Authorization", "Bearer " + buyerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Lists my negotiations successfully")
    void findMyNegotiationsSuccessfully() throws Exception {

        createNegotiation();

        driver.perform(get(URI)
                        .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].landName")
                        .value("Test Land"))
                .andExpect(jsonPath("$[0].offer")
                        .value(90000.00))
                .andExpect(jsonPath("$[0].type")
                        .value("sent"));
    }

    @Test
    @DisplayName("Finds negotiation by ID successfully")
    void findByIdSuccessfully() throws Exception {

        Negotiation negotiation = createNegotiation();

        driver.perform(get(URI + "/" + negotiation.getId())
                        .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id")
                        .value(negotiation.getId()))
                .andExpect(jsonPath("$.landName")
                        .value("Test Land"))
                .andExpect(jsonPath("$.status")
                        .value("PENDING"));
    }

    @Test
    @DisplayName("Finding nonexistent negotiation returns 404")
    void findByIdNotFound() throws Exception {

        driver.perform(get(URI + "/999999")
                        .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Seller accepts negotiation successfully")
    void acceptSuccessfully() throws Exception {

        Negotiation negotiation = createNegotiation();

        driver.perform(put(
                        URI + "/" + negotiation.getId() + "/accept")
                        .header("Authorization", "Bearer " + sellerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id")
                        .value(negotiation.getId()))
                .andExpect(jsonPath("$.status")
                        .value("ACCEPTED"));
    }

    @Test
    @DisplayName("Buyer cannot accept negotiation")
    void buyerCannotAccept() throws Exception {

        Negotiation negotiation = createNegotiation();

        driver.perform(put(
                        URI + "/" + negotiation.getId() + "/accept")
                        .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Seller rejects negotiation successfully")
    void rejectSuccessfully() throws Exception {

        Negotiation negotiation = createNegotiation();

        driver.perform(put(
                        URI + "/" + negotiation.getId() + "/reject")
                        .header("Authorization", "Bearer " + sellerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id")
                        .value(negotiation.getId()))
                .andExpect(jsonPath("$.status")
                        .value("REJECTED"));
    }

    @Test
    @DisplayName("Buyer cannot reject negotiation")
    void buyerCannotReject() throws Exception {

        Negotiation negotiation = createNegotiation();

        driver.perform(put(
                        URI + "/" + negotiation.getId() + "/reject")
                        .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Buyer cancels negotiation successfully")
    void cancelSuccessfully() throws Exception {

        Negotiation negotiation = createNegotiation();

        driver.perform(put(
                        URI + "/" + negotiation.getId() + "/cancel")
                        .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id")
                        .value(negotiation.getId()))
                .andExpect(jsonPath("$.status")
                        .value("CANCELLED"));
    }

    @Test
    @DisplayName("Seller cannot cancel negotiation")
    void sellerCannotCancel() throws Exception {

        Negotiation negotiation = createNegotiation();

        driver.perform(put(
                        URI + "/" + negotiation.getId() + "/cancel")
                        .header("Authorization", "Bearer " + sellerToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Unauthenticated request is rejected")
    void unauthenticatedRequest() throws Exception {

        driver.perform(get(URI))
                .andExpect(status().isUnauthorized());
    }

    private User createUser(String name) {

        User user = new User();

        user.setName(name);
        user.setEmail(
                "test-" + UUID.randomUUID()
                        + "@example.com");
        user.setPasswordHash("password123");

        return userRepository.save(user);
    }

    private Negotiation createNegotiation() {

        Negotiation negotiation = new Negotiation();

        negotiation.setLand(land);
        negotiation.setBuyer(buyer);
        negotiation.setSeller(seller);
        negotiation.setOffer(
                new BigDecimal("90000.00"));
        negotiation.setStatus(
                NegotiationStatus.PENDING);

        return negotiationRepository.save(negotiation);
    }

    private Polygon createPolygon() {

        GeometryFactory geometryFactory =
                new GeometryFactory();

        Coordinate[] coordinates = {
                new Coordinate(-35.230, -7.220),
                new Coordinate(-35.220, -7.220),
                new Coordinate(-35.220, -7.210),
                new Coordinate(-35.230, -7.210),
                new Coordinate(-35.230, -7.220)
        };

        LinearRing ring =
                geometryFactory.createLinearRing(
                        coordinates);

        Polygon polygon =
                geometryFactory.createPolygon(ring);

        polygon.setSRID(4326);

        return polygon;
    }
}