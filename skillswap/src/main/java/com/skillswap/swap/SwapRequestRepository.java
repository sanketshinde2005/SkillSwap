package com.skillswap.swap;

import com.skillswap.skill.Skill;
import com.skillswap.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SwapRequestRepository extends JpaRepository<SwapRequest, Long> {

    // STUDENT: outgoing swaps
    List<SwapRequest> findBySender(User sender);

    // STUDENT: incoming swaps
    List<SwapRequest> findByReceiver(User receiver);

    // Duplicate pending request prevention
    boolean existsBySenderAndSkillAndStatus(
            User sender,
            Skill skill,
            SwapStatus status
    );

    // ADMIN: list all swaps (paginated)
    Page<SwapRequest> findAll(Pageable pageable);
}
