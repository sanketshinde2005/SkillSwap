"use client";

import { useEffect, useState, useRef } from "react";
import { getSwapMessages, sendMessage, Message } from "@/lib/chat";
import { getUserEmail } from "@/lib/auth";

interface Props {
  swapId: number;
}

export default function ChatBox({ swapId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userEmail = getUserEmail();

  // Fetch messages on mount and set up polling
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getSwapMessages(swapId);
        setMessages(data);
      } catch (err) {
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Poll for new messages every 2 seconds
    const interval = setInterval(fetchMessages, 2000);

    return () => clearInterval(interval);
  }, [swapId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className="flex flex-col h-screen bg-[var(--bg-primary)]">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
      <div className="border-t border-[var(--border-primary)] p-6 bg-[var(--bg-primary)]">
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
  );
}
