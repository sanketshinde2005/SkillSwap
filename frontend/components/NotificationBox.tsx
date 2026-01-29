"use client";

import { useEffect, useState } from "react";
import { fetchNotifications, Notification } from "@/lib/notifications";

export default function NotificationBox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load notifications when opening the box
  async function loadNotifications() {
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      loadNotifications();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    if (type === "MESSAGE") return "💬";
    if (type.includes("APPROVED")) return "✅";
    if (type.includes("REJECTED")) return "❌";
    return "📢";
  };

  const getNotificationText = (notification: Notification): string => {
    if (notification.type === "MESSAGE") {
      return `${notification.from}: "${notification.content}"`;
    } else if (notification.type === "SWAP_APPROVED") {
      return `${notification.otherUser} approved your swap for ${notification.skill}`;
    } else if (notification.type === "SWAP_REJECTED") {
      return `${notification.otherUser} rejected your swap for ${notification.skill}`;
    }
    return "New notification";
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={handleToggle}
        className="relative w-9 h-9 rounded-full flex items-center justify-center
                   border border-[var(--border)]
                   hover:bg-[var(--surface)]
                   transition transform hover:scale-110"
        title="Notifications"
      >
        <span className="text-lg">🔔</span>
        {notifications.length > 0 && (
          <span
            className="absolute top-0 right-0 bg-red-500 text-white text-xs
                           rounded-full w-5 h-5 flex items-center justify-center
                           font-semibold"
          >
            {Math.min(notifications.length, 9)}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 max-h-96 rounded-lg
                     border border-[var(--border)]
                     bg-[var(--bg-card)]
                     shadow-lg z-50 overflow-hidden"
        >
          {/* Header */}
          <div
            className="px-4 py-3 border-b border-[var(--border)]
                          flex justify-between items-center"
          >
            <h3 className="font-semibold text-[var(--text-primary)]">
              Updates
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              ✕
            </button>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-80">
            {loading ? (
              <div className="px-4 py-6 text-center text-[var(--text-secondary)]">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-[var(--text-secondary)]">
                No updates yet
              </div>
            ) : (
              notifications.map((notif, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 border-b border-[var(--border)]
                             hover:bg-[var(--bg-hover)]
                             transition cursor-default"
                >
                  <div className="flex gap-2">
                    <span className="text-lg flex-shrink-0">
                      {getNotificationIcon(notif.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm text-[var(--text-primary)]
                                    break-words"
                      >
                        {getNotificationText(notif)}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        {formatTimestamp(notif.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
