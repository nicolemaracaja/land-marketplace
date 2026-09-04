package com.example.demo.controllers;

import com.example.demo.dtos.negotiation.NegotiationRequest;
import com.example.demo.dtos.negotiation.NegotiationResponse;
import com.example.demo.services.NegotiationService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/negotiations")
public class NegotiationController {

    private final NegotiationService negotiationService;

    public NegotiationController(
            NegotiationService negotiationService) {
        this.negotiationService = negotiationService;
    }

    @PostMapping
    public ResponseEntity<NegotiationResponse> create(
            @Valid @RequestBody NegotiationRequest request) {

        NegotiationResponse response =
                negotiationService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<NegotiationResponse>>
    findMyNegotiations() {

        return ResponseEntity.ok(
                negotiationService.findMyNegotiations()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<NegotiationResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                negotiationService.findById(id)
        );
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<NegotiationResponse> accept(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                negotiationService.accept(id)
        );
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<NegotiationResponse> reject(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                negotiationService.reject(id)
        );
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<NegotiationResponse> cancel(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                negotiationService.cancel(id)
        );
    }
}