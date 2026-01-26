package com.skillswap.test;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    // Accessible by ANY authenticated user
    @GetMapping("/api/secure")
    public String secureEndpoint() {
        return "You are authenticated";
    }

    // Only STUDENT role
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/api/student")
    public String studentEndpoint() {
        return "Welcome STUDENT";
    }

    // Only ADMIN role
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/admin")
    public String adminEndpoint() {
        return "Welcome ADMIN";
    }
}
