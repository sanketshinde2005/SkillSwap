package com.skillswap.swap;

import com.skillswap.swap.dto.SwapRequestCreateDto;
import com.skillswap.swap.dto.SwapRequestResponseDto;
import com.skillswap.swap.service.SwapService;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/swaps")
public class SwapRequestController {

    private final SwapService swapService;

    public SwapRequestController(SwapService swapService) {
        this.swapService = swapService;
    }

    // =================================================
    // ✅ SEND SWAP REQUEST (TRUE PEER-TO-PEER SWAP)
    // =================================================
    @PostMapping
    public SwapRequestResponseDto createSwapRequest(
            @Valid @RequestBody SwapRequestCreateDto dto,
            Authentication authentication) {
        return swapService.createSwapRequest(authentication.getName(), dto);
    }

    // ===============================
    // ✅ INCOMING REQUESTS (STUDENT)
    // ===============================
    @GetMapping("/incoming")
    public List<SwapRequestResponseDto> incomingRequests(Authentication authentication) {
        return swapService.getIncomingRequests(authentication.getName());
    }

    // ===============================
    // ✅ OUTGOING REQUESTS (STUDENT)
    // ===============================
    @GetMapping("/outgoing")
    public List<SwapRequestResponseDto> outgoingRequests(Authentication authentication) {
        return swapService.getOutgoingRequests(authentication.getName());
    }

    // ===============================
    // ✅ REQUESTED SKILL IDS (STUDENT)
    // ===============================
    @GetMapping("/requested-skills")
    public List<Long> requestedSkills(Authentication authentication) {
        return swapService.getRequestedSkillIds(authentication.getName());
    }

    // ===============================
    // ✅ ADMIN: LIST ALL SWAPS
    // ===============================
    @GetMapping
    public Page<SwapRequestResponseDto> getAllSwaps(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return swapService.getAllSwaps(page, size);
    }

    // ===============================
    // ✅ GET SWAP DETAILS BY ID
    // ===============================
    @GetMapping("/{id}")
    public SwapRequestResponseDto getSwapDetails(
            @PathVariable Long id,
            Authentication authentication) {
        return swapService.getSwapDetails(id, authentication.getName());
    }

    // ===============================
    // ✅ ACCEPT SWAP (PEER - RECEIVER ONLY)
    // ===============================
    @PatchMapping("/{id}/accept")
    public SwapRequestResponseDto acceptSwap(
            @PathVariable Long id,
            Authentication authentication) {
        return swapService.acceptSwap(id, authentication.getName());
    }

    // ===============================
    // ✅ REJECT SWAP (PEER - RECEIVER ONLY)
    // ===============================
    @PatchMapping("/{id}/reject")
    public SwapRequestResponseDto rejectSwap(
            @PathVariable Long id,
            Authentication authentication) {
        return swapService.rejectSwap(id, authentication.getName());
    }

    // ===============================
    // ✅ APPROVE SWAP (ADMIN ONLY - Legacy support)
    // ===============================
    @PatchMapping("/{id}/approve-admin")
    public SwapRequestResponseDto approveSwapAdmin(@PathVariable Long id) {
        return swapService.approveSwapAdmin(id);
    }

    // ===============================
    // ❌ CANCEL SWAP REQUEST (STUDENT)
    // ===============================
    @DeleteMapping("/{skillId}/cancel")
    public void cancelSwapRequest(
            @PathVariable Long skillId,
            Authentication authentication) {
        swapService.cancelSwapRequest(skillId, authentication.getName());
    }
}
