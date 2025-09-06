import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/layout/header";
import { MessageList } from "@/components/messaging/message-list";
import { ChatInterface } from "@/components/messaging/chat-interface";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { MessageSquareIcon, InboxIcon } from "lucide-react";

export default function Messages() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<{
    projectId: string;
    userId: string;
    userName: string;
    avatar?: string;
  } | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const handleSelectConversation = (
    projectId: string,
    userId: string,
    userName: string,
    avatar?: string
  ) => {
    setSelectedConversation({ projectId, userId, userName, avatar });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <MessageSquareIcon className="h-8 w-8 text-primary" />
            Messages
          </h1>
          <p className="text-muted-foreground">
            Communicate directly with {user.role === 'client' ? 'freelancers' : 'clients'} on your projects
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-12rem)]">
          {/* Messages Sidebar */}
          <div className="lg:col-span-2">
            <MessageList
              selectedProjectId={selectedConversation?.projectId}
              onSelectConversation={handleSelectConversation}
            />
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            {selectedConversation ? (
              <ChatInterface
                projectId={selectedConversation.projectId}
                receiverId={selectedConversation.userId}
                receiverName={selectedConversation.userName}
                receiverAvatar={selectedConversation.avatar}
              />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-16">
                  <InboxIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
                  <p className="text-muted-foreground mb-6">
                    Choose a conversation from the list to start messaging
                  </p>
                  {user.role === 'client' ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Start a project to begin messaging with freelancers
                      </p>
                      <Button
                        onClick={() => setLocation('/projects/create')}
                        data-testid="create-project-cta"
                      >
                        Post a Project
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Submit proposals to start conversations with clients
                      </p>
                      <Button
                        onClick={() => setLocation('/projects/browse')}
                        data-testid="browse-projects-cta"
                      >
                        Browse Projects
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Mobile View Instructions */}
        <div className="lg:hidden mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquareIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Better on Desktop</h3>
              <p className="text-muted-foreground text-sm">
                For the best messaging experience, we recommend using ProConnect on a desktop or tablet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
