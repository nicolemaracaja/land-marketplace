package com.example.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class Init {
    @RequestMapping("/api")
    @ResponseBody
    public String init() {
        return "API Initialized";
    }
}
