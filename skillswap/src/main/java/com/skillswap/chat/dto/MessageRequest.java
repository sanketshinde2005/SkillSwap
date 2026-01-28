package com.skillswap.chat.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class MessageRequest {

    @NotBlank(message = "Message content is required")
    public String content;

    public MessageRequest() {
    }

    public MessageRequest(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
