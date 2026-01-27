package com.skillswap.swap.dto;

import com.skillswap.swap.SwapStatus;

public class SwapRequestResponseDto {

    public Long id;

    public String senderEmail;
    public String receiverEmail;

    // Requested skill
    public Long requestedSkillId;
    public String requestedSkillName;

    // Offered skill
    public Long offeredSkillId;
    public String offeredSkillName;

    public SwapStatus status;

    public SwapRequestResponseDto(
            Long id,
            String senderEmail,
            String receiverEmail,
            Long requestedSkillId,
            String requestedSkillName,
            Long offeredSkillId,
            String offeredSkillName,
            SwapStatus status
    ) {
        this.id = id;
        this.senderEmail = senderEmail;
        this.receiverEmail = receiverEmail;
        this.requestedSkillId = requestedSkillId;
        this.requestedSkillName = requestedSkillName;
        this.offeredSkillId = offeredSkillId;
        this.offeredSkillName = offeredSkillName;
        this.status = status;
    }
}
