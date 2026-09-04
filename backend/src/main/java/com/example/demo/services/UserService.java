package com.example.demo.services;

import java.util.List;

import com.example.demo.dtos.user.UserRequest;
import com.example.demo.dtos.user.UserResponse;

public interface UserService {
    UserResponse findById(Long userId);

    List<UserResponse> findAll();

    UserResponse update(Long userId, UserRequest user);

    void delete(Long userId);
}
