package com.skillswap.swap.dto;

import jakarta.validation.constraints.NotNull;

public class SwapRequestCreateDto {

    @NotNull(message = "skillId is required")
    public Long skillId;

    @NotNull(message = "offeredSkillId is required")
    public Long offeredSkillId;

}
