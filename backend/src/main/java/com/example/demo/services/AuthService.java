package com.example.demo.services;

import com.example.demo.dtos.auth.AuthRequest;
import com.example.demo.dtos.user.UserRequest;
import com.example.demo.dtos.auth.AuthResult;

public interface AuthService {
    AuthResult login(AuthRequest request);

    AuthResult register(UserRequest request);
}
