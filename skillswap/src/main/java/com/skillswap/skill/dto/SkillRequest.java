package com.skillswap.skill.dto;

import jakarta.validation.constraints.NotBlank;

public class SkillRequest {

    @NotBlank(message = "Skill name is required")
    private String name;

    @NotBlank(message = "Skill type is required")
    private String type; // OFFER or LEARN

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }
}
