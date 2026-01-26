package com.skillswap.skill.dto;

public class SkillResponse {

    private Long id;
    private String name;
    private String type;
    private String ownerEmail;

    public SkillResponse(Long id, String name, String type, String ownerEmail) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.ownerEmail = ownerEmail;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    public String getOwnerEmail() { return ownerEmail; }
}
