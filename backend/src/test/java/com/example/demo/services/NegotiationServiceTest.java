package com.example.demo.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.example.demo.exceptions.InvalidOperationException;
import com.example.demo.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LinearRing;
import org.locationtech.jts.geom.Polygon;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dtos.negotiation.NegotiationRequest;
import com.example.demo.dtos.negotiation.NegotiationResponse;
import com.example.demo.exceptions.BusinessException;
import com.example.demo.models.entities.Land;
import com.example.demo.models.entities.Negotiation;
import com.example.demo.models.entities.User;
import com.example.demo.models.enums.NegotiationStatus;
import com.example.demo.repositories.LandRepository;
import com.example.demo.repositories.NegotiationRepository;
import com.example.demo.repositories.UserRepository;

@SpringBootTest
@Transactional
@DisplayName("Tests for Negotiation Service")
class NegotiationServiceTest {

    @Autowired
    private NegotiationService negotiationService;

    @Autowired
    private NegotiationRepository negotiationRepository;

    @Autowired
    private LandRepository landRepository;

    @Autowired
    private UserRepository userRepository;

    private User buyer;
    private User seller;
    private Land land;

    @BeforeEach
    void setup() {

        SecurityContextHolder.clearContext();

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

        authenticateAs(buyer);
    }

    @Test
    @DisplayName("Creates negotiation successfully")
    void createSuccessfully() {

        NegotiationRequest request =
                new NegotiationRequest(
                        land.getId(),
                        new BigDecimal("90000.00"));

        NegotiationResponse response =
                negotiationService.create(request);

        assertThat(response.id()).isNotNull();
        assertThat(response.landName())
                .isEqualTo("Test Land");
        assertThat(response.landPrice())
                .isEqualByComparingTo("100000.00");
        assertThat(response.offer())
                .isEqualByComparingTo("90000.00");
        assertThat(response.person())
                .isEqualTo("Seller");
        assertThat(response.status())
                .isEqualTo(NegotiationStatus.PENDING);
        assertThat(response.type())
                .isEqualTo("sent");
    }

    @Test
    @DisplayName("Throws exception when land does not exist")
    void createLandNotFound() {

        NegotiationRequest request =
                new NegotiationRequest(
                        999999L,
                        new BigDecimal("90000.00"));

        assertThatThrownBy(
                () -> negotiationService.create(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Land not found");
    }

    @Test
    @DisplayName("Throws exception when buyer is the land owner")
    void createOwnLand() {

        authenticateAs(seller);

        NegotiationRequest request =
                new NegotiationRequest(
                        land.getId(),
                        new BigDecimal("90000.00"));

        assertThatThrownBy(
                () -> negotiationService.create(request))
                .isInstanceOf(BusinessException.class)
                .hasMessage(
                        "You cannot make an offer for your own land");
    }

    @Test
    @DisplayName("Finds buyer negotiations successfully")
    void findMyNegotiationsAsBuyer() {

        Negotiation negotiation = createNegotiation();

        List<NegotiationResponse> result =
                negotiationService.findMyNegotiations();

        assertThat(result)
                .hasSize(1);

        assertThat(result.get(0).id())
                .isEqualTo(negotiation.getId());

        assertThat(result.get(0).type())
                .isEqualTo("sent");

        assertThat(result.get(0).person())
                .isEqualTo("Seller");
    }

    @Test
    @DisplayName("Finds seller negotiations successfully")
    void findMyNegotiationsAsSeller() {

        createNegotiation();

        authenticateAs(seller);

        List<NegotiationResponse> result =
                negotiationService.findMyNegotiations();

        assertThat(result)
                .hasSize(1);

        assertThat(result.get(0).type())
                .isEqualTo("received");

        assertThat(result.get(0).person())
                .isEqualTo("Buyer");
    }

    @Test
    @DisplayName("Finds negotiation by id successfully")
    void findByIdSuccessfully() {

        Negotiation negotiation = createNegotiation();

        NegotiationResponse response =
                negotiationService.findById(
                        negotiation.getId());

        assertThat(response.id())
                .isEqualTo(negotiation.getId());

        assertThat(response.status())
                .isEqualTo(NegotiationStatus.PENDING);
    }

    @Test
    @DisplayName("Throws exception when negotiation does not exist")
    void findByIdNotFound() {

        assertThatThrownBy(
                () -> negotiationService.findById(999999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Negotiation not found");
    }

    @Test
    @DisplayName("Throws exception when user is not a participant")
    void findByIdNotParticipant() {

        Negotiation negotiation = createNegotiation();

        User outsider = createUser("Outsider");

        authenticateAs(outsider);

        assertThatThrownBy(
                () -> negotiationService.findById(
                        negotiation.getId()))
                .isInstanceOf(BusinessException.class)
                .hasMessage(
                        "You are not part of this negotiation");
    }

    @Test
    @DisplayName("Seller accepts negotiation successfully")
    void acceptSuccessfully() {

        Negotiation negotiation = createNegotiation();

        authenticateAs(seller);

        NegotiationResponse response =
                negotiationService.accept(
                        negotiation.getId());

        assertThat(response.status())
                .isEqualTo(NegotiationStatus.ACCEPTED);
    }

    @Test
    @DisplayName("Buyer cannot accept negotiation")
    void buyerCannotAccept() {

        Negotiation negotiation = createNegotiation();

        authenticateAs(buyer);

        assertThatThrownBy(
                () -> negotiationService.accept(
                        negotiation.getId()))
                .isInstanceOf(InvalidOperationException.class)
                .hasMessage(
                        "Only the seller can accept the offer");
    }

    @Test
    @DisplayName("Seller rejects negotiation successfully")
    void rejectSuccessfully() {

        Negotiation negotiation = createNegotiation();

        authenticateAs(seller);

        NegotiationResponse response =
                negotiationService.reject(
                        negotiation.getId());

        assertThat(response.status())
                .isEqualTo(NegotiationStatus.REJECTED);
    }

    @Test
    @DisplayName("Buyer cannot reject negotiation")
    void buyerCannotReject() {

        Negotiation negotiation = createNegotiation();

        authenticateAs(buyer);

        assertThatThrownBy(
                () -> negotiationService.reject(
                        negotiation.getId()))
                .isInstanceOf(InvalidOperationException.class)
                .hasMessage(
                        "Only the seller can reject the offer");
    }

    @Test
    @DisplayName("Buyer cancels negotiation successfully")
    void cancelSuccessfully() {

        Negotiation negotiation = createNegotiation();

        authenticateAs(buyer);

        NegotiationResponse response =
                negotiationService.cancel(
                        negotiation.getId());

        assertThat(response.status())
                .isEqualTo(NegotiationStatus.CANCELLED);
    }

    @Test
    @DisplayName("Seller cannot cancel negotiation")
    void sellerCannotCancel() {

        Negotiation negotiation = createNegotiation();

        authenticateAs(seller);

        assertThatThrownBy(
                () -> negotiationService.cancel(
                        negotiation.getId()))
                .isInstanceOf(InvalidOperationException.class)
                .hasMessage(
                        "Only the buyer can cancel the offer");
    }

    @Test
    @DisplayName("Cannot accept negotiation that is not pending")
    void cannotAcceptNonPendingNegotiation() {

        Negotiation negotiation = createNegotiation();

        negotiation.setStatus(
                NegotiationStatus.REJECTED);

        negotiationRepository.save(negotiation);

        authenticateAs(seller);

        assertThatThrownBy(
                () -> negotiationService.accept(
                        negotiation.getId()))
                .isInstanceOf(InvalidOperationException.class)
                .hasMessage(
                        "Only pending negotiations can be accepted");
    }

    @Test
    @DisplayName("Cannot reject negotiation that is not pending")
    void cannotRejectNonPendingNegotiation() {

        Negotiation negotiation = createNegotiation();

        negotiation.setStatus(
                NegotiationStatus.ACCEPTED);

        negotiationRepository.save(negotiation);

        authenticateAs(seller);

        assertThatThrownBy(
                () -> negotiationService.reject(
                        negotiation.getId()))
                .isInstanceOf(InvalidOperationException.class)
                .hasMessage(
                        "Only pending negotiations can be rejected");
    }

    @Test
    @DisplayName("Cannot cancel negotiation that is not pending")
    void cannotCancelNonPendingNegotiation() {

        Negotiation negotiation = createNegotiation();

        negotiation.setStatus(
                NegotiationStatus.ACCEPTED);

        negotiationRepository.save(negotiation);

        authenticateAs(buyer);

        assertThatThrownBy(
                () -> negotiationService.cancel(
                        negotiation.getId()))
                .isInstanceOf(InvalidOperationException.class)
                .hasMessage(
                        "Only pending negotiations can be cancelled");
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

    private void authenticateAs(User user) {

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        null);

        SecurityContextHolder
                .getContext()
                .setAuthentication(authentication);
    }
}
