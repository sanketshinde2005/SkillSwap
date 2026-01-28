"use client";

import { useEffect, useState, useRef } from "react";
import { getSwapMessages, sendMessage, Message } from "@/lib/chat";
import { getUserEmail } from "@/lib/auth";
import { Swap } from "@/types/swap";

interface Props {
  swapId: number;
  swap?: Swap;
}

export default function ChatBox({ swapId, swap }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userEmail = getUserEmail();
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  // Determine current user's offering and requesting based on their role in the swap
  const getSkillsForCurrentUser = () => {
    if (!swap || !userEmail)
      return {
        offering: "Unknown",
        offeringUserName: "Unknown",
        requesting: "Unknown",
        requestingUserName: "Unknown",
      };

    const isCurrentUserSender =
      userEmail.toLowerCase() === swap.senderEmail.toLowerCase();

    if (isCurrentUserSender) {
      // Current user is sender - they offer what they sent and request what the receiver has
      return {
        offering: swap.offeredSkillName || "Unknown",
        offeringUserName: swap.senderName || "Unknown",
        requesting: swap.requestedSkillName || "Unknown",
        requestingUserName: swap.receiverName || "Unknown",
      };
    } else {
      // Current user is receiver - they offer what the sender requested and request what the sender offered
      return {
        offering: swap.requestedSkillName || "Unknown",
        offeringUserName: swap.receiverName || "Unknown",
        requesting: swap.offeredSkillName || "Unknown",
        requestingUserName: swap.senderName || "Unknown",
      };
    }
  };

  // Fetch messages on mount and set up polling
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (messages.length === 0) setLoading(true);
        const data = await getSwapMessages(swapId);
        setMessages(data);
      } catch (err) {
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Poll for new messages every 5 seconds (increased from 2 to reduce re-renders)
    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, [swapId]);

  // Check if user is at bottom of scroll
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const threshold = 100; // pixels from bottom
      const isAtBottom = scrollHeight - scrollTop - clientHeight < threshold;
      setIsUserAtBottom(isAtBottom);
    }
  };

  // Auto-scroll to bottom only if user is already at bottom
  useEffect(() => {
    if (isUserAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isUserAtBottom]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();

    if (!newMessage.trim()) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const sentMessage = await sendMessage(swapId, newMessage);
      setMessages([...messages, sentMessage]);
      setNewMessage("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-[var(--text-secondary)]">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center h-full bg-[var(--bg-primary)]">
      <div className="flex flex-col h-full w-full max-w-4xl">
        {/* Skills Info Header */}
        {swap &&
          (() => {
            const {
              offering,
              offeringUserName,
              requesting,
              requestingUserName,
            } = getSkillsForCurrentUser();
            return (
              <div className="border-b border-[var(--border-primary)] p-4 bg-[var(--bg-card)]">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-center flex-1">
                    <p className="text-xs text-[var(--text-muted)]">
                      {offeringUserName}
                    </p>
                    <p className="font-semibold text-sm text-[var(--text-primary)]">
                      {offering}
                    </p>
                  </div>
                  <div className="text-[var(--text-secondary)]">↔</div>
                  <div className="text-center flex-1">
                    <p className="text-xs text-[var(--text-muted)]">
                      {requestingUserName}
                    </p>
                    <p className="font-semibold text-sm text-[var(--text-primary)]">
                      {requesting}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0"
        >
          {messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-[var(--text-secondary)]">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwnMessage =
                userEmail?.toLowerCase() === msg.senderEmail.toLowerCase();

              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      isOwnMessage
                        ? "bg-[var(--accent-primary)] text-[var(--text-primary)]"
                        : "bg-[var(--bg-card)] border-2 border-[var(--border-primary)] text-[var(--text-primary)]"
                    }`}
                  >
                    <p className="text-xs font-semibold opacity-70 mb-1">
                      {msg.senderName}
                    </p>
                    <p className="text-sm break-words">{msg.content}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-[var(--border-primary)] p-4 bg-[var(--bg-primary)] flex-shrink-0">
          {error && <p className="text-sm text-[var(--error)] mb-3">{error}</p>}

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
              className="
              flex-1 px-4 py-3 rounded-xl
              border-2 border-[var(--border-secondary)]
              bg-[var(--bg-secondary)]
              text-[var(--text-primary)]
              placeholder-[var(--text-muted)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--accent-focus)]
              disabled:opacity-60
            "
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="
              px-6 py-3 rounded-xl
              border-2 border-[var(--border-primary)]
              bg-[var(--accent-primary)]
              text-[var(--text-primary)]
              font-medium
              hover:bg-[var(--accent-hover)]
              active:translate-x-[-1px]
              active:translate-y-[-1px]
              transition
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
