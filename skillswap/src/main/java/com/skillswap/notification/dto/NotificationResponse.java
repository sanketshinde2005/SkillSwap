package com.skillswap.notification.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

/**
 * Unified notification response for messages and swap status changes. Supports
 * polymorphism via "type" discriminator.
 */
public class NotificationResponse {

    @JsonProperty("type")
    private String type; // "MESSAGE", "SWAP_APPROVED", "SWAP_REJECTED"

    @JsonProperty("swapId")
    private Long swapId;

    @JsonProperty("from")
    private String from; // For MESSAGE: sender email

    @JsonProperty("content")
    private String content; // For MESSAGE

    @JsonProperty("skill")
    private String skill; // For SWAP events

    @JsonProperty("otherUser")
    private String otherUser; // For SWAP events: the other party's email

    @JsonProperty("status")
    private String status; // For SWAP events: APPROVED or REJECTED

    @JsonProperty("timestamp")
    private LocalDateTime timestamp;

    public NotificationResponse() {
    }

    // ==================
    // CONSTRUCTORS
    // ==================
    // Message notification
    public NotificationResponse(Long swapId, String from, String content, LocalDateTime timestamp) {
        this.type = "MESSAGE";
        this.swapId = swapId;
        this.from = from;
        this.content = content;
        this.timestamp = timestamp;
    }

    // Swap status notification
    public NotificationResponse(Long swapId, String status, String skill, String otherUser, LocalDateTime timestamp) {
        this.type = "SWAP_" + status; // "SWAP_APPROVED" or "SWAP_REJECTED"
        this.swapId = swapId;
        this.status = status;
        this.skill = skill;
        this.otherUser = otherUser;
        this.timestamp = timestamp;
    }

    // ==================
    // GETTERS & SETTERS
    // ==================
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getSwapId() {
        return swapId;
    }

    public void setSwapId(Long swapId) {
        this.swapId = swapId;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    public String getOtherUser() {
        return otherUser;
    }

    public void setOtherUser(String otherUser) {
        this.otherUser = otherUser;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
