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
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages on mount or when project changes
  useEffect(() => {
    fetchMessages(projectId);
  }, [projectId, fetchMessages]);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      await sendMessage(projectId, message.trim(), receiverId);
      setMessage("");
      fetchMessages(projectId); // refresh messages after sending
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

  const getInitials = (name: string) => {
    return name ? name.split(" ").map(n => n[0]).join("").toUpperCase() : "";
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const getUserInfo = (userId: string) => {
    if (userId === user?.id) return user;
    if (userId === receiverId) return receiverData;
    return { firstName: "Unknown", lastName: "", avatar: "" };
  };

  if (messagesLoading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col bg-white/95 dark:bg-card/95 shadow-2xl">
      {/* Header */}
      <CardHeader className="border-b border-border py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 online-indicator">
            <AvatarImage src={receiverData?.avatar} alt={`${receiverData?.firstName} ${receiverData?.lastName}`} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(`${receiverData?.firstName} ${receiverData?.lastName}`)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-semibold">{receiverData?.firstName} {receiverData?.lastName}</CardTitle>
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
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const sender = getUserInfo(msg.senderId);
              return (
                <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[70%] space-y-1">
                    {msg.senderId !== user?.id && (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={sender?.avatar} alt={`${sender?.firstName} ${sender?.lastName}`} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials(`${sender?.firstName} ${sender?.lastName}`)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {sender?.firstName} {sender?.lastName}
                        </span>
                      </div>
                    )}

                    <div className={`rounded-lg p-3 ${msg.senderId === user?.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{formatTime(msg.createdAt)}</span>
                      {msg.senderId === user?.id && (
                        <div className="text-xs text-muted-foreground">
                          {msg.isRead ? <CheckCheckIcon className="h-3 w-3 text-primary" /> : <CheckIcon className="h-3 w-3" />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isTyping && receiverData && (
            <div className="flex justify-start">
              <div className="max-w-[70%] space-y-1">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={receiverData.avatar} alt={`${receiverData.firstName} ${receiverData.lastName}`} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(`${receiverData.firstName} ${receiverData.lastName}`)}
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
          onChange={(e) => setMessage(e.target.value)}
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
