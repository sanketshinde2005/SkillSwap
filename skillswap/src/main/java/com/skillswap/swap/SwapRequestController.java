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

    // =================================================
    // ✅ SEND SWAP REQUEST (TRUE PEER-TO-PEER SWAP)
    // =================================================
    @PostMapping
    public SwapRequestResponseDto createSwapRequest(
            @RequestBody SwapRequestCreateDto dto,
            Authentication authentication) {

        String email = authentication.getName();
        User sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (dto.skillId == null || dto.offeredSkillId == null) {
            throw new IllegalArgumentException("Both skillId and offeredSkillId are required");
        }

        Skill requestedSkill = skillRepository.findById(dto.skillId)
                .orElseThrow(() -> new IllegalArgumentException("Requested skill not found"));

        Skill offeredSkill = skillRepository.findById(dto.offeredSkillId)
                .orElseThrow(() -> new IllegalArgumentException("Offered skill not found"));

        // ❌ Block inactive skills (SOFT DELETE SAFE)
        if (!requestedSkill.isActive() || !offeredSkill.isActive()) {
            throw new IllegalArgumentException("One of the skills is no longer available");
        }

        User receiver = requestedSkill.getUser();

        // ❌ Cannot request your own skill
        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("You cannot request your own skill");
        }

        // ❌ Offered skill must belong to sender
        if (!offeredSkill.getUser().getId().equals(sender.getId())) {
            throw new IllegalArgumentException("You can only offer your own skills");
        }

        // ❌ Only OFFER skills can be swapped
        if (!"OFFER".equals(requestedSkill.getType())
                || !"OFFER".equals(offeredSkill.getType())) {
            throw new IllegalArgumentException("Only OFFER skills can be swapped");
        }

        // ❌ Duplicate pending request protection
        if (swapRequestRepository.existsBySenderAndSkillAndStatus(
                sender, requestedSkill, SwapStatus.PENDING)) {
            throw new IllegalArgumentException(
                    "You already have a pending request for this skill"
            );
        }

        SwapRequest saved = swapRequestRepository.save(
                new SwapRequest(
                        sender,
                        receiver,
                        requestedSkill,
                        offeredSkill,
                        SwapStatus.PENDING
                )
        );

        return mapToDto(saved);
    }

    // ===============================
    // ✅ INCOMING REQUESTS (STUDENT)
    // ===============================
    @GetMapping("/incoming")
    public List<SwapRequestResponseDto> incomingRequests(Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
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
    public List<SwapRequestResponseDto> outgoingRequests(Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return swapRequestRepository.findBySender(user)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    // ===============================
    // ✅ REQUESTED SKILL IDS (STUDENT)
    // ===============================
    @GetMapping("/requested-skills")
    public List<Long> requestedSkills(Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return swapRequestRepository.findRequestedSkillIdsBySender(user);
    }

    // ===============================
    // ✅ ADMIN: LIST ALL SWAPS
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
    // ❌ CANCEL SWAP REQUEST (STUDENT)
    // ===============================
    @DeleteMapping("/{skillId}/cancel")
    public void cancelSwapRequest(
            @PathVariable Long skillId,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        SwapRequest swap = swapRequestRepository
                .findBySenderAndSkillIdAndStatus(user, skillId, SwapStatus.PENDING)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No pending swap request found"));

        swapRequestRepository.delete(swap);
    }

    // ===============================
    // 🔁 ENTITY → DTO MAPPER
    // ===============================
    private SwapRequestResponseDto mapToDto(SwapRequest swap) {

        return new SwapRequestResponseDto(
                swap.getId(),
                swap.getSender().getEmail(),
                swap.getReceiver().getEmail(),

                swap.getSkill().getId(),
                swap.getSkill().getName(),

                swap.getOfferedSkill() != null
                        ? swap.getOfferedSkill().getId()
                        : null,
                swap.getOfferedSkill() != null
                        ? swap.getOfferedSkill().getName()
                        : null,

                swap.getStatus()
        );
    }
}
