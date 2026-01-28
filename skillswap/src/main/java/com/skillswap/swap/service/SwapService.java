package com.skillswap.swap.service;

import com.skillswap.exception.custom.BadRequestException;
import com.skillswap.exception.custom.ForbiddenException;
import com.skillswap.exception.custom.NotFoundException;
import com.skillswap.skill.Skill;
import com.skillswap.skill.SkillRepository;
import com.skillswap.swap.SwapRequest;
import com.skillswap.swap.SwapRequestRepository;
import com.skillswap.swap.SwapStatus;
import com.skillswap.swap.dto.SwapRequestCreateDto;
import com.skillswap.swap.dto.SwapRequestResponseDto;
import com.skillswap.user.User;
import com.skillswap.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SwapService {

    private final SwapRequestRepository swapRequestRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public SwapService(
            SwapRequestRepository swapRequestRepository,
            SkillRepository skillRepository,
            UserRepository userRepository) {
        this.swapRequestRepository = swapRequestRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SwapRequestResponseDto createSwapRequest(
            String email,
            SwapRequestCreateDto dto) {

        User sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (dto.skillId == null || dto.offeredSkillId == null) {
            throw new BadRequestException("Both skillId and offeredSkillId are required");
        }

        Skill requestedSkill = skillRepository.findById(dto.skillId)
                .orElseThrow(() -> new NotFoundException("Requested skill not found"));

        Skill offeredSkill = skillRepository.findById(dto.offeredSkillId)
                .orElseThrow(() -> new NotFoundException("Offered skill not found"));

        // Block inactive skills (SOFT DELETE SAFE)
        if (!requestedSkill.isActive() || !offeredSkill.isActive()) {
            throw new BadRequestException("One of the skills is no longer available");
        }

        User receiver = requestedSkill.getUser();

        // Cannot request your own skill
        if (sender.getId().equals(receiver.getId())) {
            throw new BadRequestException("You cannot request your own skill");
        }

        // Offered skill must belong to sender
        if (!offeredSkill.getUser().getId().equals(sender.getId())) {
            throw new BadRequestException("You can only offer your own skills");
        }

        // Only OFFER skills can be swapped
        if (!"OFFER".equals(requestedSkill.getType())
                || !"OFFER".equals(offeredSkill.getType())) {
            throw new BadRequestException("Only OFFER skills can be swapped");
        }

        // Duplicate pending request protection
        if (swapRequestRepository.existsBySenderAndSkillAndStatus(
                sender, requestedSkill, SwapStatus.PENDING)) {
            throw new BadRequestException(
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

    public List<SwapRequestResponseDto> getIncomingRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return swapRequestRepository.findIncomingSwapsOptimized(user)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<SwapRequestResponseDto> getOutgoingRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return swapRequestRepository.findOutgoingSwapsOptimized(user)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<Long> getRequestedSkillIds(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return swapRequestRepository.findRequestedSkillIdsBySender(user);
    }

    public Page<SwapRequestResponseDto> getAllSwaps(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return swapRequestRepository.findAllOptimized(pageable)
                .map(this::mapToDto);
    }

    public SwapRequestResponseDto getSwapDetails(Long id, String email) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        SwapRequest swap = swapRequestRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Swap not found"));

        // Only sender, receiver, or admin can view swap details
        if (!swap.getSender().equals(currentUser) && !swap.getReceiver().equals(currentUser)) {
            throw new ForbiddenException("You don't have permission to view this swap");
        }

        return mapToDto(swap);
    }

    @Transactional
    public SwapRequestResponseDto acceptSwap(Long id, String email) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        SwapRequest swap = swapRequestRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Swap not found"));

        // Only receiver can accept
        if (!swap.getReceiver().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("Only the skill owner can accept this swap");
        }

        if (swap.getStatus() != SwapStatus.PENDING) {
            throw new BadRequestException("Swap already processed");
        }

        swap.setStatus(SwapStatus.APPROVED);
        SwapRequest saved = swapRequestRepository.save(swap);

        // Lock both skills when swap is approved
        lockSkillForSwap(swap.getSkill());
        lockSkillForSwap(swap.getOfferedSkill());

        return mapToDto(saved);
    }

    @Transactional
    public SwapRequestResponseDto rejectSwap(Long id, String email) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        SwapRequest swap = swapRequestRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Swap not found"));

        // Only receiver can reject
        if (!swap.getReceiver().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("Only the skill owner can reject this swap");
        }

        if (swap.getStatus() != SwapStatus.PENDING) {
            throw new BadRequestException("Swap already processed");
        }

        swap.setStatus(SwapStatus.REJECTED);
        return mapToDto(swapRequestRepository.save(swap));
    }

    @Transactional
    public SwapRequestResponseDto approveSwapAdmin(Long id) {
        SwapRequest swap = swapRequestRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Swap not found"));

        if (swap.getStatus() != SwapStatus.PENDING) {
            throw new BadRequestException("Swap already processed");
        }

        swap.setStatus(SwapStatus.APPROVED);
        SwapRequest saved = swapRequestRepository.save(swap);

        // Lock both skills when swap is approved
        lockSkillForSwap(swap.getSkill());
        lockSkillForSwap(swap.getOfferedSkill());

        return mapToDto(saved);
    }

    @Transactional
    public void cancelSwapRequest(Long skillId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        SwapRequest swap = swapRequestRepository
                .findBySenderAndSkillIdAndStatus(user, skillId, SwapStatus.PENDING)
                .orElseThrow(() -> new NotFoundException("No pending swap request found"));

        swapRequestRepository.delete(swap);
    }

    // ===============================
    // ✅ HELPER: Lock skill for approved swap
    // ===============================
    private void lockSkillForSwap(Skill skill) {
        if (skill != null && !skill.isLocked()) {
            skill.setLocked(true);
            skillRepository.save(skill);
        }
    }

    // ===============================
    // 🔁 ENTITY → DTO MAPPER
    // ===============================
    private SwapRequestResponseDto mapToDto(SwapRequest swap) {
        return new SwapRequestResponseDto(
                swap.getId(),
                swap.getSender().getEmail(),
                swap.getSender().getName(),
                swap.getReceiver().getEmail(),
                swap.getReceiver().getName(),
                swap.getSkill().getId(),
                swap.getSkill().getName(),
                swap.getOfferedSkill() != null ? swap.getOfferedSkill().getId() : null,
                swap.getOfferedSkill() != null ? swap.getOfferedSkill().getName() : null,
                swap.getStatus()
        );
    }
}
