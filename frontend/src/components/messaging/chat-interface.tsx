import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  SendIcon, 
  PaperclipIcon, 
  PhoneIcon, 
  VideoIcon, 
  MoreVerticalIcon,
  CheckIcon,
  CheckCheckIcon
} from "lucide-react";
import type { Message, Project, User } from "@shared/schema";
import type { WebSocketMessage } from "@/types";

interface ChatInterfaceProps {
  projectId: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
}

export function ChatInterface({ 
  projectId, 
  receiverId, 
  receiverName, 
  receiverAvatar 
}: ChatInterfaceProps) {
  const { user } = useAuth();
  const { sendMessage, messages: wsMessages } = useWebSocket();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messagesData, isLoading } = useQuery({
    queryKey: ['/api/projects', projectId, 'messages'],
  });

  const messages = messagesData?.messages || [];

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("User not authenticated");
      
      // Send via WebSocket for real-time delivery
      sendMessage({
        type: 'chat_message',
        projectId,
        senderId: user.id,
        receiverId,
        senderName: `${user.firstName} ${user.lastName}`,
        content,
        attachments: []
      });

      // Also save to database via API
      return apiRequest("POST", `/api/projects/${projectId}/messages`, {
        receiverId,
        content,
        attachments: []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'messages'] });
      setMessage("");
    },
  });

  // Handle new WebSocket messages
  useEffect(() => {
    const newMessages = wsMessages.filter(
      (msg: WebSocketMessage) => 
        msg.type === 'new_message' && 
        msg.message?.projectId === projectId
    );
    
    if (newMessages.length > 0) {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'messages'] });
    }
  }, [wsMessages, projectId, queryClient]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (message.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Header */}
      <CardHeader className="border-b border-border py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 online-indicator">
              <AvatarImage src={receiverAvatar} alt={receiverName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(receiverName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{receiverName}</CardTitle>
              <p className="text-sm text-muted-foreground">Online • Project Chat</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" data-testid="voice-call">
              <PhoneIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" data-testid="video-call">
              <VideoIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" data-testid="chat-options">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </div>
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
            messages.map((msg: Message) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[70%] space-y-1">
                  {msg.senderId !== user?.id && (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={receiverAvatar} alt={receiverName} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(receiverName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{receiverName}</span>
                    </div>
                  )}
                  
                  <div
                    className={`rounded-lg p-3 ${
                      msg.senderId === user?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(msg.createdAt)}
                    </span>
                    {msg.senderId === user?.id && (
                      <div className="text-xs text-muted-foreground">
                        {msg.isRead ? (
                          <CheckCheckIcon className="h-3 w-3 text-primary" />
                        ) : (
                          <CheckIcon className="h-3 w-3" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[70%] space-y-1">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={receiverAvatar} alt={receiverName} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(receiverName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{receiverName} is typing...</span>
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
      <CardContent className="border-t border-border p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" data-testid="attach-file">
            <PaperclipIcon className="h-4 w-4" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={sendMessageMutation.isPending}
            className="flex-1"
            data-testid="message-input"
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sendMessageMutation.isPending}
            size="sm"
            data-testid="send-message"
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
