package com.example.demo.services;

import com.example.demo.dtos.negotiation.NegotiationRequest;
import com.example.demo.dtos.negotiation.NegotiationResponse;

import java.util.List;

public interface NegotiationService {

    NegotiationResponse create(NegotiationRequest request);

    List<NegotiationResponse> findMyNegotiations();

    NegotiationResponse findById(Long id);

    NegotiationResponse accept(Long id);

    NegotiationResponse reject(Long id);

    NegotiationResponse cancel(Long id);
}