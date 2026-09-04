package com.example.demo.dtos.land;

import java.math.BigDecimal;
import java.util.Map;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record LandRequest(

        @NotBlank(message = "name is required")
        String name,

        @NotBlank(message = "description is required")
        String description,

        @NotNull(message = "price is required")
        @DecimalMin(
                value = "0.0",
                inclusive = false,
                message = "price must be greater than zero"
        )
        BigDecimal price,

        @NotBlank(message = "contact is required")
        String contact,

        @NotEmpty(message = "geometry is required")
        Map<String, Object> geometry
) {
}
