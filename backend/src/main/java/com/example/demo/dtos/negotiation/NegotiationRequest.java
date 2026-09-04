package com.example.demo.dtos.negotiation;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record NegotiationRequest(

        @NotNull
        Long landId,

        @NotNull
        @DecimalMin(value = "0.01")
        BigDecimal offer
) {
}