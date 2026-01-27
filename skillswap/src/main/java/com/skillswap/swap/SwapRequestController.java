package com.skillswap.swap;

import com.skillswap.skill.Skill;
import com.skillswap.skill.SkillRepository;
import com.skillswap.swap.dto.SwapRequestCreateDto;
import com.skillswap.swap.dto.SwapRequestResponseDto;
import com.skillswap.user.User;
import com.skillswap.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/swaps")
public class SwapRequestController {

    private final SwapRequestRepository swapRequestRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public SwapRequestController(
            SwapRequestRepository swapRequestRepository,
            SkillRepository skillRepository,
            UserRepository userRepository) {
        this.swapRequestRepository = swapRequestRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    // ===============================
    // ✅ SEND SWAP REQUEST (STUDENT)
    // ===============================
    @PostMapping
    public SwapRequestResponseDto createSwapRequest(
            @RequestBody SwapRequestCreateDto dto,
            Authentication authentication) {

        String email = authentication.getName();
        User sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Skill skill = skillRepository.findById(dto.skillId)
                .orElseThrow(() -> new IllegalArgumentException("Skill not found"));

        User receiver = skill.getUser();

        // ❌ Own skill protection
        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("You cannot request your own skill");
        }

        // ❌ Duplicate pending request protection
        if (swapRequestRepository.existsBySenderAndSkillAndStatus(
                sender, skill, SwapStatus.PENDING)) {
            throw new IllegalArgumentException(
                    "You already have a pending request for this skill"
            );
        }

        SwapRequest saved = swapRequestRepository.save(
                new SwapRequest(sender, receiver, skill, SwapStatus.PENDING)
        );

        return mapToDto(saved);
    }

    // ===============================
    // ✅ INCOMING REQUESTS (STUDENT)
    // ===============================
    @GetMapping("/incoming")
    public List<SwapRequestResponseDto> incomingRequests(
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return swapRequestRepository.findByReceiver(user)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    // ===============================
    // ✅ OUTGOING REQUESTS (STUDENT)
    // ===============================
    @GetMapping("/outgoing")
    public List<SwapRequestResponseDto> outgoingRequests(
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return swapRequestRepository.findBySender(user)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    // ===============================
    // ✅ NEW: REQUESTED SKILL IDS (STUDENT)
    // ===============================
    @GetMapping("/requested-skills")
    public List<Long> requestedSkills(Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return swapRequestRepository.findRequestedSkillIdsBySender(user);
    }

    // ===============================
    // ✅ ADMIN: LIST ALL SWAPS (PAGINATED)
    // ===============================
    @GetMapping
    public Page<SwapRequestResponseDto> getAllSwaps(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        return swapRequestRepository.findAll(pageable)
                .map(this::mapToDto);
    }

    // ===============================
    // ✅ APPROVE SWAP (ADMIN)
    // ===============================
    @PatchMapping("/{id}/approve")
    public SwapRequestResponseDto approveSwap(@PathVariable Long id) {

        SwapRequest swap = swapRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Swap not found"));

        if (swap.getStatus() != SwapStatus.PENDING) {
            throw new IllegalArgumentException("Swap already processed");
        }

        swap.setStatus(SwapStatus.APPROVED);
        return mapToDto(swapRequestRepository.save(swap));
    }

    // ===============================
    // ✅ REJECT SWAP (ADMIN)
    // ===============================
    @PatchMapping("/{id}/reject")
    public SwapRequestResponseDto rejectSwap(@PathVariable Long id) {

        SwapRequest swap = swapRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Swap not found"));

        if (swap.getStatus() != SwapStatus.PENDING) {
            throw new IllegalArgumentException("Swap already processed");
        }

        swap.setStatus(SwapStatus.REJECTED);
        return mapToDto(swapRequestRepository.save(swap));
    }

    // ===============================
    // 🔁 ENTITY → DTO MAPPER
    // ===============================
    private SwapRequestResponseDto mapToDto(SwapRequest swap) {
        return new SwapRequestResponseDto(
                swap.getId(),
                swap.getSender().getEmail(),
                swap.getReceiver().getEmail(),
                swap.getSkill().getName(),
                swap.getStatus()
        );
    }

    // ===============================
// ❌ CANCEL SWAP REQUEST (STUDENT)
// ===============================
    @DeleteMapping("/{skillId}/cancel")
    public void cancelSwapRequest(
            @PathVariable Long skillId,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        SwapRequest swap = swapRequestRepository
                .findBySenderAndSkillIdAndStatus(
                        user,
                        skillId,
                        SwapStatus.PENDING
                )
                .orElseThrow(() -> new IllegalArgumentException(
                        "No pending swap request found"));

        swapRequestRepository.delete(swap);
    }

}
