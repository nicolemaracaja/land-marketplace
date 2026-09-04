package com.example.demo.dtos.land;

import com.example.demo.models.enums.LandStatusEnum;

import java.math.BigDecimal;
import java.util.Map;

public record LandResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String contact,
        Map<String, Object> geometry,
        LandStatusEnum status
) {
}
