package com.example.demo.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.demo.dtos.land.LandRequest;
import com.example.demo.dtos.land.LandResponse;
import com.example.demo.dtos.land.LandSearchRequest;
import com.example.demo.exceptions.BusinessException;
import com.example.demo.exceptions.InvalidParameterException;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.mapper.LandMapper;
import com.example.demo.models.entities.User;
import com.example.demo.models.entities.Land;
import com.example.demo.repositories.LandRepository;
import com.example.demo.services.LandService;

@Service
public class LandServiceImpl implements LandService {

    private final LandRepository landRepository;
    private final LandMapper landMapper;

    public LandServiceImpl(
            LandRepository landRepository,
            LandMapper landMapper) {
        this.landRepository = landRepository;
        this.landMapper = landMapper;
    }

    @Override
    public LandResponse create(LandRequest request) {
        Land land = landMapper.toEntity(request);
        land.setOwner(getAuthenticatedUser());

        if (landRepository.existsOverlapping(land.getGeometry())) {
            throw new BusinessException("Land geometry overlaps an existing land");
        }

        Land savedLand = landRepository.save(land);
        return landMapper.toResponse(savedLand);
    }

    @Override
    public LandResponse findById(Long id) {
        Land land = landRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Land not found"));

        return landMapper.toResponse(land);
    }

    @Override
    public List<LandResponse> findAll() {
        return landRepository.findAll()
                .stream()
                .map(landMapper::toResponse)
                .toList();
    }

    @Override
    public List<LandResponse> findWithinCircle(LandSearchRequest request) {
        validateSearchParameters(
                request.latitude(),
                request.longitude(),
                request.radiusMeters());

        return landRepository.findWithinCircle(
                request.latitude(),
                request.longitude(),
                request.radiusMeters())
                .stream()
                .map(landMapper::toResponse)
                .toList();
    }

    @Override
    public LandResponse update(Long id, LandRequest request) {
        Land existingLand = landRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Land not found"));

        User authenticatedUser = getAuthenticatedUser();

        if (!existingLand.getOwner().getId().equals(authenticatedUser.getId())) {
            throw new BusinessException("Only the land owner can update it");
        }

        Land land = landMapper.toEntity(request);

        if (landRepository.existsOverlapping(land.getGeometry(), id)) {
            throw new BusinessException("Land geometry overlaps an existing land");
        }

        existingLand.setName(land.getName());
        existingLand.setDescription(land.getDescription());
        existingLand.setPrice(land.getPrice());
        existingLand.setContact(land.getContact());
        existingLand.setGeometry(land.getGeometry());

        Land updatedLand = landRepository.save(existingLand);
        return landMapper.toResponse(updatedLand);
    }

    @Override
    public void delete(Long id) {
        Land land = landRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Land not found"));

        User authenticatedUser = getAuthenticatedUser();

        if (!land.getOwner().getId().equals(authenticatedUser.getId())) {
            throw new BusinessException("Only the land owner can delete it");
        }
        
        landRepository.delete(land);
    }

    @Override
    public List<LandResponse> findMyLands() {
        User authenticatedUser = getAuthenticatedUser();

        return landRepository.findByOwner(authenticatedUser)
                .stream()
                .map(landMapper::toResponse)
                .toList();
    }

    private void validateSearchParameters(
            double latitude,
            double longitude,
            double radiusMeters) {

        if (latitude < -90 || latitude > 90) {
            throw new InvalidParameterException("Latitude must be between -90 and 90");
        }

        if (longitude < -180 || longitude > 180) {
            throw new InvalidParameterException("Longitude must be between -180 and 180");
        }

        if (radiusMeters <= 0) {
            throw new InvalidParameterException("Radius must be greater than 0");
        }
    }

    private User getAuthenticatedUser() {
        return (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }
}