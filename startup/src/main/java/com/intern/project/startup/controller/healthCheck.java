package com.intern.project.startup.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class healthCheck {

    @GetMapping("/healthCheck")
    public String check(){
        return "ok";
    }
}
