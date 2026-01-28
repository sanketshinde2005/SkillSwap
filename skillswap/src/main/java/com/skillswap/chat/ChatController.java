package com.skillswap.chat;

import com.skillswap.chat.dto.MessageRequest;
import com.skillswap.chat.dto.MessageResponse;
import com.skillswap.chat.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // ===============================
    // 📨 GET MESSAGES FOR A SWAP
    // ===============================
    @GetMapping("/swap/{swapId}")
    public ResponseEntity<List<MessageResponse>> getSwapMessages(
            @PathVariable Long swapId,
            Authentication authentication
    ) {
        List<MessageResponse> messages = chatService.getSwapMessages(swapId, authentication.getName());
        return ResponseEntity.ok(messages);
    }

    // ===============================
    // 💬 SEND MESSAGE FOR A SWAP
    // ===============================
    @PostMapping("/swap/{swapId}")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable Long swapId,
            @Valid @RequestBody MessageRequest messageRequest,
            Authentication authentication
    ) {
        MessageResponse response = chatService.sendMessage(swapId, messageRequest, authentication.getName());
        return ResponseEntity.ok(response);
    }
}
