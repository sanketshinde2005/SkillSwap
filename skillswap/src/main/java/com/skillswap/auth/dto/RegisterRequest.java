package com.skillswap.auth.dto;

public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private String role;

    // No-args constructor (REQUIRED for @RequestBody)
    public RegisterRequest() {
    }

    // All-args constructor
    public RegisterRequest(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }
}


