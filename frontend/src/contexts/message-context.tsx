import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./auth-context";
import { Message } from "../types";
import * as messagesAPI from "../utils/messages";

type MessageContextType = {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  fetchMessages: () => Promise<void>;
  sendMessage: (content: string, receiverId?: string) => Promise<void>;
};

const MessageContext = createContext<MessageContextType | null>(null);

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) throw new Error("useMessages must be used within MessageProvider");
  return context;
};

export const MessageProvider: React.FC<{ projectId: string; children: ReactNode }> = ({ projectId, children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages for this project
  const fetchMessages = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await messagesAPI.getMessagesByProject(projectId);
      setMessages(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async (content: string, receiverId?: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      const newMessage = await messagesAPI.sendMessage(projectId, content, receiverId);
      setMessages((prev) => [...prev, newMessage]);
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch messages when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchMessages();
    }
  }, [projectId]);

  return (
    <MessageContext.Provider
      value={{
        messages,
        isLoading,
        error,
        fetchMessages,
        sendMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
