package com.skillswap.user.service;

import com.skillswap.exception.custom.NotFoundException;
import com.skillswap.skill.Skill;
import com.skillswap.skill.SkillRepository;
import com.skillswap.skill.dto.SkillResponse;
import com.skillswap.swap.SwapRequestRepository;
import com.skillswap.user.User;
import com.skillswap.user.UserRepository;
import com.skillswap.user.dto.UserProfileResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final SwapRequestRepository swapRequestRepository;

    public UserService(
            UserRepository userRepository,
            SkillRepository skillRepository,
            SwapRequestRepository swapRequestRepository
    ) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.swapRequestRepository = swapRequestRepository;
    }

    public UserProfileResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        // Skills - offering
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

        // Swap stats - count only APPROVED swaps
        long incomingRequests = swapRequestRepository.findByReceiver(user).stream()
                .filter(sr -> "APPROVED".equals(sr.getStatus().name()))
                .count();
        long outgoingRequests = swapRequestRepository.findBySender(user).stream()
                .filter(sr -> "APPROVED".equals(sr.getStatus().name()))
                .count();

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
