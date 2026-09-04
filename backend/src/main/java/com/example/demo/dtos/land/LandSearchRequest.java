package com.example.demo.dtos.land;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record LandSearchRequest(
        @NotNull(message = "latitude is required")
        Double latitude,

        @NotNull(message = "longitude is required")
        Double longitude,

        @NotNull(message = "radius is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "radius must be greater than zero")
        Double radiusMeters
) {}