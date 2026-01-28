package com.skillswap.user;

import com.skillswap.skill.Skill;
import com.skillswap.skill.SkillRepository;
import com.skillswap.skill.dto.SkillResponse;
import com.skillswap.swap.SwapRequestRepository;
import com.skillswap.user.dto.UserProfileResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final SwapRequestRepository swapRequestRepository;

    public UserController(
            UserRepository userRepository,
            SkillRepository skillRepository,
            SwapRequestRepository swapRequestRepository
    ) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.swapRequestRepository = swapRequestRepository;
    }

    // ===============================
    // ✅ GET LOGGED-IN USER PROFILE
    // ===============================
    @GetMapping("/me")
    public UserProfileResponse getMyProfile(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // -------------------------------
        // Skills
        // -------------------------------
        List<SkillResponse> offering = skillRepository.findByUser(user).stream()
                .filter(skill -> "OFFER".equals(skill.getType()))
                .map(skill -> mapSkillWithOwnerName(skill, skill.getUser().getName()))
                .toList();

        // Get all OTHER users' OFFER skills for the learning section
        List<SkillResponse> learning = skillRepository.findAll().stream()
                .filter(skill -> "OFFER".equals(skill.getType()))
                .filter(skill -> !skill.getUser().equals(user)) // Exclude own skills
                .map(skill -> mapSkillWithOwnerName(skill, skill.getUser().getName()))
                .toList();

        // -------------------------------
        // Swap stats
        // -------------------------------
        long incomingRequests = swapRequestRepository.findByReceiver(user).size();
        long outgoingRequests = swapRequestRepository.findBySender(user).size();

        UserProfileResponse.ProfileStats stats
                = new UserProfileResponse.ProfileStats(
                        incomingRequests,
                        outgoingRequests
                );

        return new UserProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                offering,
                learning,
                stats
        );
    }

    // ===============================
    // 🔁 ENTITY → DTO MAPPER
    // ===============================
    private SkillResponse mapSkill(Skill skill) {
        return new SkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getType(),
                skill.getUser().getEmail()
        );
    }

    private SkillResponse mapSkillWithOwnerName(Skill skill, String ownerName) {
        return new SkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getType(),
                skill.getUser().getEmail(),
                ownerName
        );
    }
}
