package com.skillswap.skill.service;

import com.skillswap.exception.custom.BadRequestException;
import com.skillswap.exception.custom.ForbiddenException;
import com.skillswap.exception.custom.NotFoundException;
import com.skillswap.skill.Skill;
import com.skillswap.skill.SkillRepository;
import com.skillswap.skill.dto.SkillRequest;
import com.skillswap.skill.dto.SkillResponse;
import com.skillswap.swap.SwapRequestRepository;
import com.skillswap.swap.SwapStatus;
import com.skillswap.user.User;
import com.skillswap.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final SwapRequestRepository swapRequestRepository;

    public SkillService(
            SkillRepository skillRepository,
            UserRepository userRepository,
            SwapRequestRepository swapRequestRepository
    ) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.swapRequestRepository = swapRequestRepository;
    }

    public Skill addSkill(String email, SkillRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return skillRepository.save(
                new Skill(request.getName(), request.getType(), user)
        );
    }

    public List<SkillResponse> getAllSkills() {
        return skillRepository.findAllActiveUnlockedSkillsOptimized()
                .stream()
                .map(skill -> new SkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getType(),
                skill.getUser().getEmail()
        ))
                .toList();
    }

    @Transactional
    public void deleteSkill(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Skill not found"));

        // Ownership check
        if (!skill.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You can delete only your own skills");
        }

        // Active swap protection
        boolean hasActiveSwaps = swapRequestRepository.existsBySkillAndStatusIn(
                skill,
                List.of(SwapStatus.PENDING, SwapStatus.APPROVED)
        );

        if (hasActiveSwaps) {
            throw new BadRequestException(
                    "Skill cannot be deleted while it has active swap requests"
            );
        }

        // Soft delete
        skill.setActive(false);
        skillRepository.save(skill);
    }

    /**
     * ✅ NEW: Get current user's OFFER skills Used for OFFER tab: only user's
     * own skills
     */
    public List<SkillResponse> getMyOffers(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return skillRepository.findActiveSkillsByUserOptimized(user)
                .stream()
                .filter(skill -> "OFFER".equals(skill.getType()))
                .map(skill -> new SkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getType(),
                skill.getUser().getEmail(),
                skill.getUser().getName()
        ))
                .toList();
    }

    /**
     * ✅ NEW: Get all OFFER skills except current user's Used for LEARN tab:
     * global visibility Supports optional search query (case-insensitive,
     * partial match)
     */
    public List<SkillResponse> getAvailableToLearn(String email, String query) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        List<SkillResponse> availableSkills = skillRepository.findAllActiveUnlockedSkillsOptimized()
                .stream()
                .filter(skill -> "OFFER".equals(skill.getType())) // Only OFFER skills
                .filter(skill -> !skill.getUser().getId().equals(currentUser.getId())) // Exclude own skills
                .map(skill -> new SkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getType(),
                skill.getUser().getEmail(),
                skill.getUser().getName()
        ))
                .toList();

        // Apply search filter if provided
        if (query != null && !query.trim().isEmpty()) {
            String lowerQuery = query.toLowerCase().trim();
            return availableSkills.stream()
                    .filter(skill -> skill.getName().toLowerCase().contains(lowerQuery))
                    .toList();
        }

        return availableSkills;
    }
}
