package com.example.demo.services.impl;

import com.example.demo.dtos.negotiation.NegotiationRequest;
import com.example.demo.dtos.negotiation.NegotiationResponse;
import com.example.demo.exceptions.BusinessException;
import com.example.demo.exceptions.InvalidOperationException;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.entities.Land;
import com.example.demo.models.entities.Negotiation;
import com.example.demo.models.entities.User;
import com.example.demo.models.enums.NegotiationStatus;
import com.example.demo.repositories.LandRepository;
import com.example.demo.repositories.NegotiationRepository;
import com.example.demo.services.NegotiationService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class NegotiationServiceImpl implements NegotiationService {

    private final NegotiationRepository negotiationRepository;
    private final LandRepository landRepository;

    public NegotiationServiceImpl(
            NegotiationRepository negotiationRepository,
            LandRepository landRepository) {
        this.negotiationRepository = negotiationRepository;
        this.landRepository = landRepository;
    }

    @Override
    public NegotiationResponse create(NegotiationRequest request) {

        User buyer = getAuthenticatedUser();

        Land land = landRepository.findById(request.landId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Land not found"));

        if (land.getOwner().getId().equals(buyer.getId())) {
            throw new BusinessException(
                    "You cannot make an offer for your own land");
        }

        Negotiation negotiation = new Negotiation();

        negotiation.setLand(land);
        negotiation.setBuyer(buyer);
        negotiation.setSeller(land.getOwner());
        negotiation.setOffer(request.offer());
        negotiation.setStatus(NegotiationStatus.PENDING);

        Negotiation saved = negotiationRepository.save(negotiation);

        return toResponse(saved, buyer);
    }

    @Override
    public List<NegotiationResponse> findMyNegotiations() {

        User user = getAuthenticatedUser();

        List<Negotiation> negotiations = new ArrayList<>();

        negotiations.addAll(
                negotiationRepository.findByBuyer(user)
        );

        negotiations.addAll(
                negotiationRepository.findBySeller(user)
        );

        return negotiations.stream()
                .map(negotiation -> toResponse(negotiation, user))
                .toList();
    }

    @Override
    public NegotiationResponse findById(Long id) {

        User user = getAuthenticatedUser();

        Negotiation negotiation = getNegotiation(id);

        validateParticipant(negotiation, user);

        return toResponse(negotiation, user);
    }

    @Override
    public NegotiationResponse accept(Long id) {

        User user = getAuthenticatedUser();

        Negotiation negotiation = getNegotiation(id);

        validateParticipant(negotiation, user);

        if (!negotiation.getSeller().getId().equals(user.getId())) {
            throw new InvalidOperationException(
                    "Only the seller can accept the offer");
        }

        if (negotiation.getStatus() != NegotiationStatus.PENDING) {
            throw new InvalidOperationException(
                    "Only pending negotiations can be accepted");
        }

        negotiation.setStatus(NegotiationStatus.ACCEPTED);

        Negotiation saved = negotiationRepository.save(negotiation);

        return toResponse(saved, user);
    }

    @Override
    public NegotiationResponse reject(Long id) {

        User user = getAuthenticatedUser();

        Negotiation negotiation = getNegotiation(id);

        validateParticipant(negotiation, user);

        if (!negotiation.getSeller().getId().equals(user.getId())) {
            throw new InvalidOperationException(
                    "Only the seller can reject the offer");
        }

        if (negotiation.getStatus() != NegotiationStatus.PENDING) {
            throw new InvalidOperationException(
                    "Only pending negotiations can be rejected");
        }

        negotiation.setStatus(NegotiationStatus.REJECTED);

        Negotiation saved = negotiationRepository.save(negotiation);

        return toResponse(saved, user);
    }

    @Override
    public NegotiationResponse cancel(Long id) {

        User user = getAuthenticatedUser();

        Negotiation negotiation = getNegotiation(id);

        validateParticipant(negotiation, user);

        if (!negotiation.getBuyer().getId().equals(user.getId())) {
            throw new InvalidOperationException(
                    "Only the buyer can cancel the offer");
        }

        if (negotiation.getStatus() != NegotiationStatus.PENDING) {
            throw new InvalidOperationException(
                    "Only pending negotiations can be cancelled");
        }

        negotiation.setStatus(NegotiationStatus.CANCELLED);

        Negotiation saved = negotiationRepository.save(negotiation);

        return toResponse(saved, user);
    }

    private Negotiation getNegotiation(Long id) {

        return negotiationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Negotiation not found"));
    }

    private void validateParticipant(
            Negotiation negotiation,
            User user) {

        boolean isBuyer =
                negotiation.getBuyer().getId().equals(user.getId());

        boolean isSeller =
                negotiation.getSeller().getId().equals(user.getId());

        if (!isBuyer && !isSeller) {
            throw new BusinessException(
                    "You are not part of this negotiation");
        }
    }

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !(authentication.getPrincipal() instanceof User)) {

            throw new BusinessException(
                    "User not authenticated");
        }

        return (User) authentication.getPrincipal();
    }

    private NegotiationResponse toResponse(
            Negotiation negotiation,
            User currentUser) {

        boolean isBuyer =
                negotiation.getBuyer()
                        .getId()
                        .equals(currentUser.getId());

        User otherPerson =
                isBuyer
                        ? negotiation.getSeller()
                        : negotiation.getBuyer();

        return new NegotiationResponse(
                negotiation.getId(),
                negotiation.getLand().getName(),
                negotiation.getLand().getPrice(),
                negotiation.getOffer(),
                otherPerson.getName(),
                negotiation.getStatus(),
                isBuyer ? "sent" : "received"
        );
    }
}