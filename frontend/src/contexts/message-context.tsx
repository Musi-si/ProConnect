import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "./auth-context";
import { Message } from "../types";
import { sendMessage as sendMessageApi, getMessagesByProject } from "../utils/messages";
import { io, Socket } from "socket.io-client";

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
  const { user } = useAuth(); // We need the user object to check the senderId
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages - no changes needed here
  const fetchMessages = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMessagesByProject(projectId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  }, [projectId, user]);

  // Send message (optimistic update) - no changes needed here
  const sendMessage = useCallback(
    async (content: string, receiverId?: string) => {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        const newMessage = await sendMessageApi(projectId, content, receiverId);
        // This is the optimistic update for the sender
        setMessages((prev) => [...prev, newMessage]);
      } catch (err: any) {
        setError(err.message || "Failed to send message");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [projectId, user]
  );
  
  // Initial fetch
  useEffect(() => {
    if (projectId && user) {
      fetchMessages();
    }
  }, [fetchMessages, projectId, user]);

  // WebSocket integration
  useEffect(() => {
    if (!projectId || !user) return;

    const socket: Socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log(`Socket connected: ${socket.id}. Joining room: project_${projectId}`);
      socket.emit("joinProject", projectId);
    });

    // ** THE FIX IS HERE **
    socket.on("newMessage", (incomingMessage: Message) => {
      console.log("Received new message via WebSocket:", incomingMessage);
      if (String(incomingMessage.senderId) !== String(user.id)) {
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      } else {
        console.log("Ignoring own message from WebSocket to prevent duplicate.");
      }
    });
    
    socket.on("disconnect", () => console.log("Socket disconnected"));
    socket.on("connect_error", (err) => console.error("Socket connection error:", err.message));

    return () => {
      socket.disconnect();
    };
  }, [projectId, user]); // Depend on user object to access user.id

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