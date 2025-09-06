import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import { MessageSquareIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Message } from "@shared/schema";

interface Conversation {
  projectId: string;
  lastMessage: Message;
  unreadCount: number;
  projectTitle?: string;
  otherUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface MessageListProps {
  selectedProjectId?: string;
  onSelectConversation: (projectId: string, userId: string, userName: string, avatar?: string) => void;
}

export function MessageList({ selectedProjectId, onSelectConversation }: MessageListProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ['/api/conversations'],
  });

  const conversations: Conversation[] = conversationsData?.conversations || [];

  const filteredConversations = conversations.filter((conv) =>
    conv.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (date: Date | string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const truncateMessage = (message: string, maxLength = 60) => {
    return message.length > maxLength ? `${message.slice(0, maxLength)}...` : message;
  };

  if (isLoading) {
    return (
      <Card className="h-[600px]">
        <CardContent className="p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px]">
      <CardContent className="p-0">
        {/* Search Header */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-10"
              data-testid="search-conversations"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="h-[520px]">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
              <MessageSquareIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No conversations</h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery ? "No conversations match your search." : "Start a project to begin messaging with freelancers."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredConversations.map((conversation) => {
                const isSelected = conversation.projectId === selectedProjectId;
                const otherUser = conversation.otherUser || {
                  id: 'unknown',
                  name: 'Unknown User',
                };

                return (
                  <Button
                    key={conversation.projectId}
                    variant="ghost"
                    className={`w-full p-4 h-auto justify-start hover:bg-secondary/50 transition-colors ${
                      isSelected ? 'bg-secondary' : ''
                    }`}
                    onClick={() =>
                      onSelectConversation(
                        conversation.projectId,
                        otherUser.id,
                        otherUser.name,
                        otherUser.avatar
                      )
                    }
                    data-testid={`conversation-${conversation.projectId}`}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(otherUser.name)}
                          </AvatarFallback>
                        </Avatar>
                        {/* Online indicator could be added here */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      </div>
                      
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">
                            {otherUser.name}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessage.createdAt)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate flex-1">
                            {truncateMessage(conversation.lastMessage.content)}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        
                        {conversation.projectTitle && (
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            Project: {conversation.projectTitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
