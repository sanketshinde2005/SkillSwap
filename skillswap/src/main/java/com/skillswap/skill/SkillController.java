package com.skillswap.skill;

import com.skillswap.skill.dto.SkillRequest;
import com.skillswap.skill.dto.SkillResponse;
import com.skillswap.swap.SwapRequestRepository;
import com.skillswap.swap.SwapStatus;
import com.skillswap.user.User;
import com.skillswap.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final SwapRequestRepository swapRequestRepository;

    public SkillController(
            SkillRepository skillRepository,
            UserRepository userRepository,
            SwapRequestRepository swapRequestRepository
    ) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.swapRequestRepository = swapRequestRepository;
    }

    // ===============================
    // ✅ ADD SKILL
    // ===============================
    @PostMapping
    public Skill addSkill(@RequestBody SkillRequest request, Authentication auth) {

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return skillRepository.save(
                new Skill(request.getName(), request.getType(), user)
        );
    }

    // ===============================
    // ✅ GET ALL SKILLS (exclude soft-deleted & locked)
    // ===============================
    @GetMapping
    public List<SkillResponse> getAllSkills() {

        return skillRepository.findAll()
                .stream()
                .filter(skill -> skill.isActive() && !skill.isLocked())
                .map(skill -> new SkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getType(),
                skill.getUser().getEmail()
        ))
                .toList();
    }

    // ===============================
    // ✅ DELETE SKILL (SOFT DELETE - OWNER ONLY)
    // ===============================
    @DeleteMapping("/{id}")
    public void deleteSkill(@PathVariable Long id, Authentication auth) {

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Skill not found"));

        // ❌ Ownership check
        if (!skill.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can delete only your own skills");
        }

        // ❌ Active swap protection
        boolean hasActiveSwaps
                = swapRequestRepository.existsBySkillAndStatusIn(
                        skill,
                        List.of(SwapStatus.PENDING, SwapStatus.APPROVED)
                );

        if (hasActiveSwaps) {
            throw new IllegalArgumentException(
                    "Skill cannot be deleted while it has active swap requests"
            );
        }

        // ✅ SOFT DELETE: mark as inactive instead of hard delete
        skill.setActive(false);
        skillRepository.save(skill);
    }
}
