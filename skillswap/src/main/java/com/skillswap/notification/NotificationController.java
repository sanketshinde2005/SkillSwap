package com.skillswap.notification;

import com.skillswap.notification.dto.NotificationResponse;
import com.skillswap.notification.service.NotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * GET /api/notifications Returns unified feed of last 10 events (messages +
     * swap status changes) ordered by timestamp DESC
     */
    @GetMapping
    public List<NotificationResponse> getNotifications(Authentication authentication) {
        return notificationService.getNotifications(authentication.getName());
    }
}
