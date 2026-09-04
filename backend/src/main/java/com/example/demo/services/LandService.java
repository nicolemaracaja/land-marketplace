package com.example.demo.services;

import java.util.List;

import com.example.demo.dtos.land.LandRequest;
import com.example.demo.dtos.land.LandResponse;
import com.example.demo.dtos.land.LandSearchRequest;
import com.example.demo.models.entities.Land;

public interface LandService {
    LandResponse create(LandRequest request);

    LandResponse findById(Long id);

    List<LandResponse> findAll();

    List<LandResponse> findWithinCircle(LandSearchRequest request);

    LandResponse update(Long id, LandRequest request);

    void delete(Long id);

    List<LandResponse> findMyLands();
}
