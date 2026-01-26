package com.skillswap.skill;

import com.skillswap.skill.dto.SkillRequest;
import com.skillswap.skill.dto.SkillResponse;
import com.skillswap.user.User;
import com.skillswap.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public SkillController(SkillRepository skillRepository, UserRepository userRepository) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    // ✅ Any authenticated user
    @PostMapping
    public Skill addSkill(@RequestBody SkillRequest request) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email).orElseThrow();

        return skillRepository.save(
                new Skill(request.getName(), request.getType(), user)
        );
    }

    // ✅ Any authenticated user (THIS is the failing one)
    @GetMapping
    public List<SkillResponse> getAllSkills() {

        return skillRepository.findAll()
                .stream()
                .map(skill -> new SkillResponse(
                        skill.getId(),
                        skill.getName(),
                        skill.getType(),
                        skill.getUser().getEmail()
                ))
                .toList();
    }


    // ✅ User-specific
    @GetMapping("/my")
    public List<SkillResponse> mySkills() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email).orElseThrow();

        return skillRepository.findByUser(user)
                .stream()
                .map(skill -> new SkillResponse(
                        skill.getId(),
                        skill.getName(),
                        skill.getType(),
                        user.getEmail()
                ))
                .toList();
    }

}

