package com.skillswap.swap;

import com.skillswap.skill.Skill;
import com.skillswap.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface SwapRequestRepository extends JpaRepository<SwapRequest, Long> {

    // ===============================
    // STUDENT: outgoing swaps
    // ===============================
    List<SwapRequest> findBySender(User sender);

    // ===============================
    // STUDENT: incoming swaps
    // ===============================
    List<SwapRequest> findByReceiver(User receiver);

    // ===============================
    // Duplicate pending request prevention
    // ===============================
    boolean existsBySenderAndSkillAndStatus(
            User sender,
            Skill skill,
            SwapStatus status
    );

    boolean existsBySkillAndStatusIn(
            Skill skill,
            List<SwapStatus> statuses
    );

    // ===============================
    // ADMIN: list all swaps (paginated)
    // ===============================
    Page<SwapRequest> findAll(Pageable pageable);

    // ===============================
    // ✅ NEW: Skill IDs already requested by student (PENDING only)
    // ===============================
    @Query("""
        select sr.skill.id
        from SwapRequest sr
        where sr.sender = :user
          and sr.status = com.skillswap.swap.SwapStatus.PENDING
    """)
    List<Long> findRequestedSkillIdsBySender(User user);

    Optional<SwapRequest> findBySenderAndSkillIdAndStatus(
            User sender,
            Long skillId,
            SwapStatus status
    );

    // ===============================
    // OPTIMIZED: Prevent N+1 on user/skill fetch
    // ===============================
    @Query("""
        select distinct sr
        from SwapRequest sr
        join fetch sr.sender
        join fetch sr.receiver
        join fetch sr.skill
        join fetch sr.offeredSkill
        where sr.sender = :sender
    """)
    List<SwapRequest> findOutgoingSwapsOptimized(@Param("sender") User sender);

    @Query("""
        select distinct sr
        from SwapRequest sr
        join fetch sr.sender
        join fetch sr.receiver
        join fetch sr.skill
        join fetch sr.offeredSkill
        where sr.receiver = :receiver
    """)
    List<SwapRequest> findIncomingSwapsOptimized(@Param("receiver") User receiver);

    @Query("""
        select distinct sr
        from SwapRequest sr
        join fetch sr.sender
        join fetch sr.receiver
        join fetch sr.skill
        join fetch sr.offeredSkill
    """)
    Page<SwapRequest> findAllOptimized(Pageable pageable);
}
