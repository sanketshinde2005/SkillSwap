package com.skillswap.swap.dto;

import com.skillswap.swap.SwapStatus;

public class SwapRequestResponseDto {

    public Long id;
    public String senderEmail;
    public String receiverEmail;
    public String skillName;
    public SwapStatus status;

    public SwapRequestResponseDto(
            Long id,
            String senderEmail,
            String receiverEmail,
            String skillName,
            SwapStatus status
    ) {
        this.id = id;
        this.senderEmail = senderEmail;
        this.receiverEmail = receiverEmail;
        this.skillName = skillName;
        this.status = status;
    }
}
