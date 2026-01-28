package com.skillswap.chat;

import com.skillswap.chat.dto.MessageRequest;
import com.skillswap.chat.dto.MessageResponse;
import com.skillswap.swap.SwapRequest;
import com.skillswap.swap.SwapRequestRepository;
import com.skillswap.swap.SwapStatus;
import com.skillswap.user.User;
import com.skillswap.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final MessageRepository messageRepository;
    private final SwapRequestRepository swapRequestRepository;
    private final UserRepository userRepository;

    public ChatController(
            MessageRepository messageRepository,
            SwapRequestRepository swapRequestRepository,
            UserRepository userRepository
    ) {
        this.messageRepository = messageRepository;
        this.swapRequestRepository = swapRequestRepository;
        this.userRepository = userRepository;
    }

    // ===============================
    // 📨 GET MESSAGES FOR A SWAP
    // ===============================
    @GetMapping("/swap/{swapId}")
    public ResponseEntity<List<MessageResponse>> getSwapMessages(
            @PathVariable Long swapId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        SwapRequest swap = swapRequestRepository.findById(swapId)
                .orElseThrow(() -> new IllegalArgumentException("Swap not found"));

        // Only sender and receiver can see messages
        if (!swap.getSender().equals(user) && !swap.getReceiver().equals(user)) {
            return ResponseEntity.status(403).build();
        }

        // Only approved swaps can have messages
        if (!swap.getStatus().equals(SwapStatus.APPROVED)) {
            return ResponseEntity.status(400).body(List.of());
        }

        List<Message> messages = messageRepository.findBySwapOrderByCreatedAtAsc(swap);
        List<MessageResponse> responses = messages.stream()
                .map(msg -> new MessageResponse(
                        msg.getId(),
                        msg.getSwap().getId(),
                        msg.getSender().getEmail(),
                        msg.getSender().getName(),
                        msg.getContent(),
                        msg.getCreatedAt()
                ))
                .toList();

        return ResponseEntity.ok(responses);
    }

    // ===============================
    // 💬 SEND MESSAGE FOR A SWAP
    // ===============================
    @PostMapping("/swap/{swapId}")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable Long swapId,
            @RequestBody MessageRequest messageRequest,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        SwapRequest swap = swapRequestRepository.findById(swapId)
                .orElseThrow(() -> new IllegalArgumentException("Swap not found"));

        // Only sender and receiver can send messages
        if (!swap.getSender().equals(user) && !swap.getReceiver().equals(user)) {
            return ResponseEntity.status(403).build();
        }

        // Only approved swaps can have messages
        if (!swap.getStatus().equals(SwapStatus.APPROVED)) {
            return ResponseEntity.status(400).build();
        }

        // Validate message content
        if (messageRequest.getContent() == null || messageRequest.getContent().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Message message = new Message(swap, user, messageRequest.getContent());
        Message savedMessage = messageRepository.save(message);

        MessageResponse response = new MessageResponse(
                savedMessage.getId(),
                savedMessage.getSwap().getId(),
                savedMessage.getSender().getEmail(),
                savedMessage.getSender().getName(),
                savedMessage.getContent(),
                savedMessage.getCreatedAt()
        );

        return ResponseEntity.ok(response);
    }
}
