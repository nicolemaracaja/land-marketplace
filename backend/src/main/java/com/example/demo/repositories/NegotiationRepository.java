package com.example.demo.repositories;

import com.example.demo.models.entities.Negotiation;
import com.example.demo.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NegotiationRepository extends JpaRepository<Negotiation, Long> {

    List<Negotiation> findByBuyer(User buyer);

    List<Negotiation> findBySeller(User seller);

    List<Negotiation> findByLandId(Long landId);
}