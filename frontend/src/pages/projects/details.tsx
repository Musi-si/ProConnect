import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { ProposalForm } from "@/components/projects/proposal-form";
import { ProposalList } from "@/components/projects/proposal-list";
import { MilestoneTracker } from "@/components/milestones/milestone-tracker";
import { ChatInterface } from "@/components/messaging/chat-interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { useProject } from "@/contexts/project-context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeftIcon,
  CalendarIcon,
  DollarSignIcon,
  ClockIcon,
  UserIcon,
  MessageSquareIcon,
  StarIcon,
  MapPinIcon,
  FileTextIcon,
  EyeIcon
} from "lucide-react";

export default function ProjectDetails() {
  const params = useParams();
  const projectId = Number(params.id);
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const { projects, isLoading: projectsLoading } = useProject();
  const project = projects.find(p => p.id === projectId) || null;

  const proposals = project?.proposals || [];

  // Accept proposal mutation
  const acceptProposalMutation = useMutation({
    mutationFn: async (proposalId: string) => {
      const response = await apiRequest("PUT", `/api/proposals/${proposalId}/accept`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Proposal Accepted",
        description: "The freelancer has been notified and the project has begun.",
      });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Submit proposal mutation
  const submitProposalMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/proposals`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Proposal Submitted",
        description: "Your proposal has been sent to the client.",
      });
      setActiveTab("overview");
    },
  });

  if (projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
          <Link href="/projects/browse">
            <Button>Browse Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const canSubmitProposal = user?.role === 'freelancer' && project.status === 'open';
  const isProjectOwner = user?.id === project.clientId;
  const isAssignedFreelancer = user?.id === project.freelancerId;

  // Ensure skills and attachments are parsed correctly
  const skills = Array.isArray(project.skills) ? project.skills : [];
  const attachments = Array.isArray(project.attachments) ? project.attachments : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/projects/browse">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>

        {/* Project Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge variant="outline" className="capitalize">{project.category}</Badge>
                      <Badge className={getStatusColor(project.status)} variant="secondary">
                        {getStatusText(project.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <EyeIcon className="mr-2 h-4 w-4" />
                      234 views
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Project Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSignIcon className="h-4 w-4 text-primary mr-1" />
                        <span className="font-bold text-lg text-primary">${project.budget}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Budget</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <ClockIcon className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="font-bold">{project.timeline}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Timeline</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <UserIcon className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="font-bold">{proposals.length}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Proposals</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="font-bold">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">Posted</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold mb-3">Project Description</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{project.description}</p>
                    </div>
                  </div>

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {attachments.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Attachments</h3>
                      <div className="space-y-2">
                        {attachments.map((attachment: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Attachment {index + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt="Client" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      CL
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Client Name</div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                      <span>4.8 (23 reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                    <span>United States</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span>12 projects posted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                    <span>$25,000 total spent</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {canSubmitProposal && (
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setActiveTab("submit-proposal")}
                data-testid="submit-proposal-button"
              >
                Submit Proposal
              </Button>
            )}

            {isProjectOwner && project.status === 'open' && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setActiveTab("proposals")}
                data-testid="view-proposals-button"
              >
                <UserIcon className="mr-2 h-4 w-4" />
                View Proposals ({proposals.length})
              </Button>
            )}

            {(isProjectOwner || isAssignedFreelancer) && project.status === 'in_progress' && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setActiveTab("messages")}
                data-testid="open-messages-button"
              >
                <MessageSquareIcon className="mr-2 h-4 w-4" />
                Open Messages
              </Button>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            {canSubmitProposal && (
              <TabsTrigger value="submit-proposal" data-testid="tab-submit-proposal">Submit Proposal</TabsTrigger>
            )}
            {isProjectOwner && (
              <TabsTrigger value="proposals" data-testid="tab-proposals">
                Proposals ({proposals.length})
              </TabsTrigger>
            )}
            {project.status === 'in_progress' && (isProjectOwner || isAssignedFreelancer) && (
              <>
                <TabsTrigger value="milestones" data-testid="tab-milestones">Milestones</TabsTrigger>
                <TabsTrigger value="messages" data-testid="tab-messages">Messages</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>
                  Complete project details and requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All project information is displayed above. Use the tabs to navigate between different sections.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {canSubmitProposal && (
            <TabsContent value="submit-proposal" className="mt-6">
              <ProposalForm
                projectId={projectId}
                projectTitle={project.title}
                projectBudget={project.budget}
                onSubmit={submitProposalMutation.mutateAsync}
                isLoading={submitProposalMutation.isPending}
              />
            </TabsContent>
          )}

          {isProjectOwner && (
            <TabsContent value="proposals" className="mt-6">
              <ProposalList
                proposals={proposals}
                // isLoading={proposalsLoading}
                onAccept={acceptProposalMutation.mutateAsync}
                showActions={true}
              />
            </TabsContent>
          )}

          {project.status === 'in_progress' && (isProjectOwner || isAssignedFreelancer) && (
            <>
              <TabsContent value="milestones" className="mt-6">
                <MilestoneTracker
                  projectId={projectId}
                  showPaymentActions={isProjectOwner}
                />
              </TabsContent>

              <TabsContent value="messages" className="mt-6">
                <ChatInterface
                  projectId={projectId}
                  receiverId={isProjectOwner ? project.freelancerId || '' : project.clientId}
                  receiverName={isProjectOwner ? "Assigned Freelancer" : "Client"}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
