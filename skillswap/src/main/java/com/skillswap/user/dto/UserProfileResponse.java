package com.skillswap.user.dto;

import com.skillswap.skill.dto.SkillResponse;
import java.util.List;

public class UserProfileResponse {

    public String name;
    public String email;
    public String role;
    public List<SkillResponse> offering;
    public List<SkillResponse> learning;
    public ProfileStats stats;

    public UserProfileResponse(
            String name,
            String email,
            String role,
            List<SkillResponse> offering,
            List<SkillResponse> learning,
            ProfileStats stats
    ) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.offering = offering;
        this.learning = learning;
        this.stats = stats;
    }

    // ===============================
    // 📊 PROFILE STATS DTO
    // ===============================
    public static class ProfileStats {
        public long incomingRequests;
        public long outgoingRequests;

        public ProfileStats(long incomingRequests, long outgoingRequests) {
            this.incomingRequests = incomingRequests;
            this.outgoingRequests = outgoingRequests;
        }
    }
}
