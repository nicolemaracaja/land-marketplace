package com.example.demo.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.example.demo.repositories.NegotiationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.demo.models.entities.User;
import com.example.demo.dtos.land.LandRequest;
import com.example.demo.dtos.land.LandResponse;
import com.example.demo.dtos.land.LandSearchRequest;
import com.example.demo.exceptions.BusinessException;
import com.example.demo.exceptions.InvalidParameterException;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.repositories.LandRepository;
import com.example.demo.repositories.UserRepository;

@SpringBootTest
@Transactional
@DisplayName("Tests for Land Service")
class LandServiceTest {

    @Autowired
    private LandService landService;

    @Autowired
    private LandRepository landRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NegotiationRepository negotiationRepository;

    private User authenticatedUser;

    private final GeometryFactory geometryFactory = new GeometryFactory();

    @BeforeEach
    void setup() {
        SecurityContextHolder.clearContext();

        negotiationRepository.deleteAll();
        landRepository.deleteAll();
        userRepository.deleteAll();

        authenticatedUser = userRepository.save(
                new User(
                        null,
                        "Test User",
                        "test@example.com",
                        "password123",
                        null,
                        null));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        authenticatedUser,
                        null,
                        null));
    }

    @Test
    @DisplayName("Creates land successfully")
    void createSuccessfully() {

        LandRequest request = createRequest(
                "Land One",
                createPolygon(0, 0, 1, 1));

        LandResponse created = landService.create(request);

        assertThat(created.id()).isNotNull();
        assertThat(created.name()).isEqualTo("Land One");
        assertThat(created.description()).isEqualTo("Test land");
        assertThat(created.price()).isEqualByComparingTo("100000.00");
        assertThat(created.contact()).isEqualTo("contact@example.com");

        assertThat(landRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("Does not allow overlapping land")
    void createOverlap() {

        LandRequest firstRequest = createRequest(
                "Land One",
                createPolygon(0, 0, 1, 1));

        landService.create(firstRequest);

        LandRequest overlappingRequest = createRequest(
                "Land Two",
                createPolygon(0.5, 0.5, 1.5, 1.5));

        assertThatThrownBy(() -> landService.create(overlappingRequest))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Land geometry overlaps an existing land");
    }

    @Test
    @DisplayName("Finds land by id successfully")
    void findByIdSuccessfully() {

        LandResponse created = landService.create(
                createRequest(
                        "Land One",
                        createPolygon(0, 0, 1, 1)));

        LandResponse found = landService.findById(created.id());

        assertThat(found.id()).isEqualTo(created.id());
        assertThat(found.name()).isEqualTo("Land One");
    }

    @Test
    @DisplayName("Throws exception when land does not exist")
    void findByIdNotFound() {

        assertThatThrownBy(() -> landService.findById(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Finds all lands successfully")
    void findAllSuccessfully() {

        LandResponse landOne = landService.create(
                createRequest(
                        "Land One",
                        createPolygon(0, 0, 1, 1)));

        LandResponse landTwo = landService.create(
                createRequest(
                        "Land Two",
                        createPolygon(2, 2, 3, 3)));

        List<LandResponse> result = landService.findAll();

        assertThat(result).hasSize(2);

        assertThat(result)
                .extracting(LandResponse::id)
                .containsExactlyInAnyOrder(
                        landOne.id(),
                        landTwo.id());
    }

    @Test
    @DisplayName("Finds lands within search circle")
    void findWithinCircleSuccessfully() {

        landService.create(
                createRequest(
                        "Nearby Land",
                        createPolygon(-0.01, -0.01, 0.01, 0.01)));

        landService.create(
                createRequest(
                        "Far Land",
                        createPolygon(10, 10, 11, 11)));

        LandSearchRequest search = new LandSearchRequest(
                0.0,
                0.0,
                2000.0);

        List<LandResponse> result = landService.findWithinCircle(search);

        assertThat(result)
                .extracting(LandResponse::name)
                .contains("Nearby Land");

        assertThat(result)
                .extracting(LandResponse::name)
                .doesNotContain("Far Land");
    }

    @Test
    @DisplayName("Throws exception when latitude is invalid")
    void findWithinCircleInvalidLatitude() {

        LandSearchRequest search = new LandSearchRequest(
                91.0,
                0.0,
                1000.0);

        assertThatThrownBy(() -> landService.findWithinCircle(search))
                .isInstanceOf(InvalidParameterException.class)
                .hasMessage("Latitude must be between -90 and 90");
    }

    @Test
    @DisplayName("Throws exception when longitude is invalid")
    void findWithinCircleInvalidLongitude() {

        LandSearchRequest search = new LandSearchRequest(
                0.0,
                181.0,
                1000.0);

        assertThatThrownBy(() -> landService.findWithinCircle(search))
                .isInstanceOf(InvalidParameterException.class)
                .hasMessage("Longitude must be between -180 and 180");
    }

    @Test
    @DisplayName("Throws exception when radius is invalid")
    void findWithinCircleInvalidRadius() {

        LandSearchRequest search = new LandSearchRequest(
                0.0,
                0.0,
                0.0);

        assertThatThrownBy(() -> landService.findWithinCircle(search))
                .isInstanceOf(InvalidParameterException.class)
                .hasMessage("Radius must be greater than 0");
    }

    @Test
    @DisplayName("Updates land successfully")
    void updateSuccessfully() {

        LandResponse created = landService.create(
                createRequest(
                        "Land One",
                        createPolygon(0, 0, 1, 1)));

        LandRequest update = createRequest(
                "Updated Land",
                createPolygon(2, 2, 3, 3));

        LandResponse updated = landService.update(created.id(), update);

        assertThat(updated.id()).isEqualTo(created.id());
        assertThat(updated.name()).isEqualTo("Updated Land");
        assertThat(updated.price())
                .isEqualByComparingTo("100000.00");
    }

    @Test
    @DisplayName("Does not allow another user to update the land")
    void updateByAnotherUserNotAllowed() {

        LandResponse created = landService.create(
                createRequest(
                        "Land One",
                        createPolygon(0, 0, 1, 1)));

        User anotherUser = userRepository.save(
                new User(
                        null,
                        "Another User",
                        "another@example.com",
                        "password123",
                        null,
                        null));

        authenticateUser(anotherUser);

        LandRequest update = createRequest(
                "Updated Land",
                createPolygon(2, 2, 3, 3));

        assertThatThrownBy(() -> landService.update(created.id(), update))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Only the land owner can update it");
    }

    @Test
    @DisplayName("Throws exception when updating nonexistent land")
    void updateNotFound() {

        LandRequest request = createRequest(
                "Land",
                createPolygon(0, 0, 1, 1));

        assertThatThrownBy(() -> landService.update(999L, request))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Does not allow update with overlapping land")
    void updateOverlap() {

        LandResponse firstLand = landService.create(
                createRequest(
                        "Land One",
                        createPolygon(0, 0, 1, 1)));

        landService.create(
                createRequest(
                        "Land Two",
                        createPolygon(3, 3, 4, 4)));

        LandRequest update = createRequest(
                "Updated Land",
                createPolygon(3.5, 3.5, 4.5, 4.5));

        assertThatThrownBy(() -> landService.update(firstLand.id(), update))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Land geometry overlaps an existing land");
    }

    @Test
    @DisplayName("Deletes land successfully")
    void deleteSuccessfully() {

        LandResponse created = landService.create(
                createRequest(
                        "Land One",
                        createPolygon(0, 0, 1, 1)));

        landService.delete(created.id());

        assertThat(
                landRepository.findById(created.id())).isEmpty();
    }

    @Test
    @DisplayName("Does not allow another user to delete the land")
    void deleteByAnotherUserNotAllowed() {

        LandResponse created = landService.create(
                createRequest(
                        "Land One",
                        createPolygon(0, 0, 1, 1)));

        User anotherUser = userRepository.save(
                new User(
                        null,
                        "Another User",
                        "another-delete@example.com",
                        "password123",
                        null,
                        null));

        authenticateUser(anotherUser);

        assertThatThrownBy(() -> landService.delete(created.id()))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Only the land owner can delete it");

        assertThat(landRepository.findById(created.id())).isPresent();
    }

    @Test
    @DisplayName("Throws exception when deleting nonexistent land")
    void deleteNotFound() {

        assertThatThrownBy(() -> landService.delete(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    private LandRequest createRequest(
            String name,
            Polygon polygon) {

        return new LandRequest(
                name,
                "Test land",
                new BigDecimal("100000.00"),
                "contact@example.com",
                Map.of(
                        "type", "Polygon",
                        "coordinates", polygonToCoordinates(polygon)));
    }

    private Polygon createPolygon(
            double minX,
            double minY,
            double maxX,
            double maxY) {

        Coordinate[] coordinates = new Coordinate[] {
                new Coordinate(minX, minY),
                new Coordinate(maxX, minY),
                new Coordinate(maxX, maxY),
                new Coordinate(minX, maxY),
                new Coordinate(minX, minY)
        };

        Polygon polygon = geometryFactory.createPolygon(coordinates);

        polygon.setSRID(4326);

        return polygon;
    }

    private List<List<List<Double>>> polygonToCoordinates(
            Polygon polygon) {

        Coordinate[] coordinates = polygon.getExteriorRing().getCoordinates();

        List<List<Double>> points = java.util.Arrays.stream(coordinates)
                .map(coordinate -> List.of(
                        coordinate.getX(),
                        coordinate.getY()))
                .toList();

        return List.of(points);
    }

    private void authenticateUser(User user) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        null));
    }
}