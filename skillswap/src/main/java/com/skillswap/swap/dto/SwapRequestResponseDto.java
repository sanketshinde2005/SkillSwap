package com.skillswap.swap.dto;

import com.skillswap.swap.SwapStatus;

public class SwapRequestResponseDto {

    public Long id;

    public String senderEmail;
    public String senderName;
    public String receiverEmail;
    public String receiverName;

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
            String senderName,
            String receiverEmail,
            String receiverName,
            Long requestedSkillId,
            String requestedSkillName,
            Long offeredSkillId,
            String offeredSkillName,
            SwapStatus status
    ) {
        this.id = id;
        this.senderEmail = senderEmail;
        this.senderName = senderName;
        this.receiverEmail = receiverEmail;
        this.receiverName = receiverName;
        this.requestedSkillId = requestedSkillId;
        this.requestedSkillName = requestedSkillName;
        this.offeredSkillId = offeredSkillId;
        this.offeredSkillName = offeredSkillName;
        this.status = status;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getReceiverEmail() {
        return receiverEmail;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public Long getRequestedSkillId() {
        return requestedSkillId;
    }

    public String getRequestedSkillName() {
        return requestedSkillName;
    }

    public Long getOfferedSkillId() {
        return offeredSkillId;
    }

    public String getOfferedSkillName() {
        return offeredSkillName;
    }

    public SwapStatus getStatus() {
        return status;
    }
}
