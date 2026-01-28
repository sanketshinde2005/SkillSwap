package com.skillswap.chat.service;

import com.skillswap.chat.Message;
import com.skillswap.chat.MessageRepository;
import com.skillswap.chat.dto.MessageRequest;
import com.skillswap.chat.dto.MessageResponse;
import com.skillswap.exception.custom.BadRequestException;
import com.skillswap.exception.custom.ForbiddenException;
import com.skillswap.exception.custom.NotFoundException;
import com.skillswap.swap.SwapRequest;
import com.skillswap.swap.SwapRequestRepository;
import com.skillswap.swap.SwapStatus;
import com.skillswap.user.User;
import com.skillswap.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatService {

    private final MessageRepository messageRepository;
    private final SwapRequestRepository swapRequestRepository;
    private final UserRepository userRepository;

    public ChatService(
            MessageRepository messageRepository,
            SwapRequestRepository swapRequestRepository,
            UserRepository userRepository
    ) {
        this.messageRepository = messageRepository;
        this.swapRequestRepository = swapRequestRepository;
        this.userRepository = userRepository;
    }

    public List<MessageResponse> getSwapMessages(Long swapId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        SwapRequest swap = swapRequestRepository.findById(swapId)
                .orElseThrow(() -> new NotFoundException("Swap not found"));

        // Only sender and receiver can see messages
        if (!swap.getSender().equals(user) && !swap.getReceiver().equals(user)) {
            throw new ForbiddenException("You don't have permission to view these messages");
        }

        // Only approved swaps can have messages
        if (!swap.getStatus().equals(SwapStatus.APPROVED)) {
            return List.of();
        }

        List<Message> messages = messageRepository.findBySwapOrderByCreatedAtAsc(swap);
        return messages.stream()
                .map(msg -> new MessageResponse(
                msg.getId(),
                msg.getSwap().getId(),
                msg.getSender().getEmail(),
                msg.getSender().getName(),
                msg.getContent(),
                msg.getCreatedAt()
        ))
                .toList();
    }

    @Transactional
    public MessageResponse sendMessage(Long swapId, MessageRequest messageRequest, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        SwapRequest swap = swapRequestRepository.findById(swapId)
                .orElseThrow(() -> new NotFoundException("Swap not found"));

        // Only sender and receiver can send messages
        if (!swap.getSender().equals(user) && !swap.getReceiver().equals(user)) {
            throw new ForbiddenException("You don't have permission to send messages in this swap");
        }

        // Only approved swaps can have messages
        if (!swap.getStatus().equals(SwapStatus.APPROVED)) {
            throw new BadRequestException("Only approved swaps can have messages");
        }

        // Validate message content
        if (messageRequest.getContent() == null || messageRequest.getContent().isBlank()) {
            throw new BadRequestException("Message content cannot be empty");
        }

        Message message = new Message(swap, user, messageRequest.getContent());
        Message savedMessage = messageRepository.save(message);

        return new MessageResponse(
                savedMessage.getId(),
                savedMessage.getSwap().getId(),
                savedMessage.getSender().getEmail(),
                savedMessage.getSender().getName(),
                savedMessage.getContent(),
                savedMessage.getCreatedAt()
        );
    }
}
