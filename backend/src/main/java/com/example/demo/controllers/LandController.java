package com.example.demo.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dtos.land.LandRequest;
import com.example.demo.dtos.land.LandResponse;
import com.example.demo.dtos.land.LandSearchRequest;
import com.example.demo.services.LandService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/lands")
public class LandController {

    private final LandService landService;

    public LandController(LandService landService) {
        this.landService = landService;
    }

    @PostMapping
    public ResponseEntity<LandResponse> create(
            @Valid @RequestBody LandRequest request) {

        LandResponse createdLand = landService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdLand);
    }

    @GetMapping("/my")
    public ResponseEntity<List<LandResponse>> findMyLands() {
        return ResponseEntity.ok(
                landService.findMyLands());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LandResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                landService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<LandResponse>> findAll() {

        return ResponseEntity.ok(
                landService.findAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<LandResponse>> search(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam double radiusMeters) {

        LandSearchRequest request = new LandSearchRequest(
                latitude,
                longitude,
                radiusMeters);

        return ResponseEntity.ok(
                landService.findWithinCircle(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LandResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody LandRequest request) {

        return ResponseEntity.ok(
                landService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        landService.delete(id);

        return ResponseEntity.noContent().build();
    }
}