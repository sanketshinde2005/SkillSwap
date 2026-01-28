package com.skillswap.chat.dto;

import java.time.LocalDateTime;

public class MessageResponse {
    public Long id;
    public Long swapId;
    public String senderEmail;
    public String senderName;
    public String content;
    public LocalDateTime createdAt;

    public MessageResponse(Long id, Long swapId, String senderEmail, String senderName, String content, LocalDateTime createdAt) {
        this.id = id;
        this.swapId = swapId;
        this.senderEmail = senderEmail;
        this.senderName = senderName;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getSwapId() {
        return swapId;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
