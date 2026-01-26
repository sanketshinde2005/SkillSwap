package com.skillswap.skill;

import com.skillswap.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findByUser(User user);
}
