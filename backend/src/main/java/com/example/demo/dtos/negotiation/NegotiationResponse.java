package com.example.demo.dtos.negotiation;

import com.example.demo.models.enums.NegotiationStatus;

import java.math.BigDecimal;

public record NegotiationResponse(
        Long id,
        String landName,
        BigDecimal landPrice,
        BigDecimal offer,
        String person,
        NegotiationStatus status,
        String type
) {
}