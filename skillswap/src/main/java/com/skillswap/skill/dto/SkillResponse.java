package com.skillswap.skill.dto;

public class SkillResponse {

    private Long id;
    private String name;
    private String type;
    private String ownerEmail;
    private String ownerName;

    public SkillResponse(Long id, String name, String type, String ownerEmail) {
        this(id, name, type, ownerEmail, null);
    }

    public SkillResponse(Long id, String name, String type, String ownerEmail, String ownerName) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.ownerEmail = ownerEmail;
        this.ownerName = ownerName;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public String getOwnerName() {
        return ownerName;
    }
}
