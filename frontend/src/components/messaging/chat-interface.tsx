import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/auth-context";
import { useMessages } from "@/contexts/message-context";
import {
  SendIcon,
  PaperclipIcon,
  PhoneIcon,
  VideoIcon,
  MoreVerticalIcon,
  CheckIcon,
  CheckCheckIcon
} from "lucide-react";
import type { Message, User } from "@shared/schema";

interface ChatInterfaceProps {
  projectId: string;
  receiverId: string; // currently chatting with
  receiverData: User; // receiver info passed in
}

export function ChatInterface({ projectId, receiverId, receiverData }: ChatInterfaceProps) {
  const { user } = useAuth();
  const { messages, fetchMessages, sendMessage, isLoading: messagesLoading } = useMessages();

  console.log("the message ", messages);

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages on mount or when project changes
  useEffect(() => {
    // Corrected: No longer passing projectId to context's fetchMessages
    fetchMessages();
  }, [fetchMessages]);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      // Corrected: No longer passing projectId to context's sendMessage
      await sendMessage(message.trim(), String(receiverId));
      console.log('chat interface info: ', message.trim(), receiverId);
      setMessage(""); // clear input
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const formatTime = (date: Date | string) => {
    // Ensure date is valid before formatting
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return "Invalid Date";
    }
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const getUserInfo = (userId: string | number | undefined) => {
    if (!userId) return { firstName: "Unknown", lastName: "", avatar: "" };

    // Convert user?.id to number for comparison if it's number on backend
    const currentUserId = user?.id; // Assuming user.id is string
    const targetReceiverId = receiverId; // Assuming receiverId is string

    if (String(userId) === String(currentUserId)) return user;
    if (String(userId) === String(targetReceiverId)) return receiverData;
    return { firstName: "Unknown", lastName: "", avatar: "" };
  };

  if (messagesLoading || !user) { // Added !user check for safety
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </Card>
    );
  }

  // Ensure receiverData is available before rendering chat
  if (!receiverData) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <CardContent className="text-center">
          <p className="text-muted-foreground">Loading chat partner details...</p>
        </CardContent>
      </Card>
    );
  }

  const receiverFullName = `${receiverData?.firstName || ""} ${receiverData?.lastName || ""}`.trim();

  return (
    <Card className="h-[600px] flex flex-col bg-white/95 dark:bg-card/95 shadow-2xl">
      {/* Header */}
      <CardHeader className="border-b border-border py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 online-indicator">
            <AvatarImage src={receiverData?.profilePicture} alt={receiverFullName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(receiverFullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-semibold">{receiverFullName}</CardTitle>
            <p className="text-sm text-muted-foreground">Online • Project Chat</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm"><PhoneIcon className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><VideoIcon className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><MoreVerticalIcon className="h-4 w-4" /></Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {Array.isArray(messages) && messages.length > 0 ? (
            messages.map((msg) => {
              // Ensure msg is a valid object before accessing properties
              if (!msg || typeof msg !== 'object') {
                return <div key={`invalid-${Math.random()}`} className="text-destructive text-sm">Invalid message object</div>;
              }
              const sender = getUserInfo(msg.senderId);
              // Fallback for sender full name if not available
              const senderFullName = `${sender?.firstName || ""} ${sender?.lastName || ""}`.trim() || "Unknown";

              return (
                <div key={msg.id} className={`flex ${String(msg.senderId) === String(user?.id) ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[70%] space-y-1">
                    {String(msg.senderId) !== String(user?.id) && (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={sender?.profilePicture} alt={senderFullName} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials(senderFullName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {senderFullName}
                        </span>
                      </div>
                    )}

                    <div className={`rounded-lg p-3 ${String(msg.senderId) === String(user?.id) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{formatTime(msg.createdAt)}</span>
                      {String(msg.senderId) === String(user?.id) && (
                        <div className="text-xs text-muted-foreground">
                          {msg.isRead ? <CheckCheckIcon className="h-3 w-3 text-primary" /> : <CheckIcon className="h-3 w-3" />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}

          {isTyping && receiverData && (
            <div className="flex justify-start">
              <div className="max-w-[70%] space-y-1">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={receiverData.profilePicture} alt={receiverFullName} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(receiverFullName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{receiverData.firstName} is typing...</span>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <CardContent className="border-t border-border p-4 flex items-center space-x-2">
        <Button variant="ghost" size="sm"><PaperclipIcon className="h-4 w-4" /></Button>
        <Input
          value={message}
          onChange={(e: any) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          size="sm"
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}