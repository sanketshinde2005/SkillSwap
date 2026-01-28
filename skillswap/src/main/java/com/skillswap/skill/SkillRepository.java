package com.skillswap.skill;

import com.skillswap.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findByUser(User user);

    // ===============================
    // OPTIMIZED: Prevent N+1 on user fetch
    // ===============================
    @Query("""
        select distinct s
        from Skill s
        join fetch s.user
        where s.isActive = true
        and s.isLocked = false
    """)
    List<Skill> findAllActiveUnlockedSkillsOptimized();

    // ===============================
    // OPTIMIZED: Skills by user with eager load
    // ===============================
    @Query("""
        select distinct s
        from Skill s
        join fetch s.user
        where s.user = :user
        and s.isActive = true
    """)
    List<Skill> findActiveSkillsByUserOptimized(@Param("user") User user);
}
