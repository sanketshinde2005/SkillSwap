package com.skillswap.skill;

import com.skillswap.skill.dto.SkillRequest;
import com.skillswap.skill.dto.SkillResponse;
import com.skillswap.skill.service.SkillService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    // ===============================
    // ✅ ADD SKILL
    // ===============================
    @PostMapping
    public Skill addSkill(@Valid @RequestBody SkillRequest request, Authentication auth) {
        return skillService.addSkill(auth.getName(), request);
    }

    // ===============================
    // ✅ GET ALL SKILLS (exclude soft-deleted & locked)
    // ===============================
    @GetMapping
    public List<SkillResponse> getAllSkills() {
        return skillService.getAllSkills();
    }

    // ===============================
    // ✅ NEW: GET MY OFFERS (current user's OFFER skills)
    // ===============================
    @GetMapping("/my-offers")
    public List<SkillResponse> getMyOffers(Authentication auth) {
        return skillService.getMyOffers(auth.getName());
    }

    // ===============================
    // ✅ NEW: GET AVAILABLE TO LEARN (global OFFER skills, excluding mine)
    // ===============================
    @GetMapping("/available-to-learn")
    public List<SkillResponse> getAvailableToLearn(
            @RequestParam(required = false) String query,
            Authentication auth
    ) {
        return skillService.getAvailableToLearn(auth.getName(), query);
    }

    // ===============================
    // ✅ DELETE SKILL (SOFT DELETE - OWNER ONLY)
    // ===============================
    @DeleteMapping("/{id}")
    public void deleteSkill(@PathVariable Long id, Authentication auth) {
        skillService.deleteSkill(id, auth.getName());
    }
}
