package com.skillswap.notification.service;

import com.skillswap.chat.Message;
import com.skillswap.chat.MessageRepository;
import com.skillswap.notification.dto.NotificationResponse;
import com.skillswap.swap.SwapRequest;
import com.skillswap.swap.SwapRequestRepository;
import com.skillswap.swap.SwapStatus;
import com.skillswap.user.User;
import com.skillswap.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class NotificationService {

    private final MessageRepository messageRepository;
    private final SwapRequestRepository swapRequestRepository;
    private final UserRepository userRepository;

    public NotificationService(
            MessageRepository messageRepository,
            SwapRequestRepository swapRequestRepository,
            UserRepository userRepository
    ) {
        this.messageRepository = messageRepository;
        this.swapRequestRepository = swapRequestRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get unified notifications for logged-in user. Returns last 10 events
     * (messages + swap status changes) ordered by timestamp DESC.
     */
    public List<NotificationResponse> getNotifications(String email) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<NotificationResponse> notifications = new ArrayList<>();

        // ==================
        // 1. MESSAGE NOTIFICATIONS
        // ==================
        // Messages sent to swaps where currentUser is receiver
        List<SwapRequest> incomingSwaps = swapRequestRepository.findByReceiver(currentUser);
        for (SwapRequest swap : incomingSwaps) {
            List<Message> messages = messageRepository.findBySwapOrderByCreatedAtAsc(swap);
            for (Message msg : messages) {
                notifications.add(
                        new NotificationResponse(
                                swap.getId(),
                                msg.getSender().getEmail(),
                                msg.getContent(),
                                msg.getCreatedAt()
                        )
                );
            }
        }

        // Messages sent to swaps where currentUser is sender
        List<SwapRequest> outgoingSwaps = swapRequestRepository.findBySender(currentUser);
        for (SwapRequest swap : outgoingSwaps) {
            List<Message> messages = messageRepository.findBySwapOrderByCreatedAtAsc(swap);
            for (Message msg : messages) {
                notifications.add(
                        new NotificationResponse(
                                swap.getId(),
                                msg.getSender().getEmail(),
                                msg.getContent(),
                                msg.getCreatedAt()
                        )
                );
            }
        }

        // ==================
        // 2. SWAP STATUS NOTIFICATIONS
        // ==================
        // Swap approved/rejected for swaps where currentUser is sender (they requested)
        for (SwapRequest swap : outgoingSwaps) {
            if (swap.getStatus() == SwapStatus.APPROVED || swap.getStatus() == SwapStatus.REJECTED) {
                notifications.add(
                        new NotificationResponse(
                                swap.getId(),
                                swap.getStatus().name(),
                                swap.getSkill().getName(),
                                swap.getReceiver().getEmail(),
                                new Date().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime()
                        )
                );
            }
        }

        // ==================
        // 3. SORT & LIMIT
        // ==================
        // Sort by timestamp DESC
        notifications.sort((n1, n2) -> n2.getTimestamp().compareTo(n1.getTimestamp()));

        // Return last 10
        return notifications.stream()
                .limit(10)
                .toList();
    }
}
