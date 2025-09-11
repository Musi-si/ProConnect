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
import { MessageProvider } from "@/contexts/message-context"; // ✅ import
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

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition mb-3"
                >
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link><br />
              <Link href="/projects/all">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                >
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back to Projects
                </Button>
              </Link>
            </div>
            <div className="flex-1 flex justify-center">
              <h1 className="text-3xl font-bold text-[var(--primary)]">{project.title}</h1>
            </div>
            <div className="flex-1" /> {/* Spacer for symmetry */}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/95 dark:bg-card/95 shadow-2xl">
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
                    <Button variant="outline" size="sm" className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition">
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
                        <span className="font-bold text-lg text-primary">{project.budget}</span>
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

                  {/* Milestones Proposed */}
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Proposed Milestones</h3>
                    {Array.from(Array.isArray(project.milestones) ? project.milestones : JSON.parse(project.milestones || "[]")).length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {Array.from(Array.isArray(project.milestones) ? project.milestones : JSON.parse(project.milestones || "[]")).map((ms: any) => (
                          <Card key={ms.id} className="bg-white/95 dark:bg-card/95 shadow-md hover:shadow-lg transition">
                            <CardContent className="space-y-2">
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold">{ms.title}</h4>
                                <Badge
                                  className={
                                    ms.status === "completed"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                  }
                                >
                                  {ms.status === "completed" ? "Completed" : "Pending"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-3">{ms.description}</p>
                              <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Proposed Payment: ${ms.payment}</span>
                                {isProjectOwner && ms.status === "pending" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                                    onClick={''}
                                  >
                                    Mark as Completed
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No milestones proposed yet.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <Card className="bg-white/95 dark:bg-card/95 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg">About the Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    {project.clientAvatar ? (
                      <AvatarImage
                        src={project.clientAvatar}
                        alt={project.clientName || "Client"}
                      />
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {project.clientName?.split(" ").map(n => n[0]).join("") || "CL"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-semibold">{project.clientName}</div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                      <span>
                        {project.clientRating ? parseFloat(project.clientRating).toFixed(1) : "N/A"} (
                        {project.clientReviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {/* Optional: if you have location stored elsewhere */}
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{project.clientLocation}</span>
                  </div>
                  {project.projectsPosted != null && (
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{project.projectsPosted} projects posted</span>
                    </div>
                  )}
                  {project.totalSpent != null && (
                    <div className="flex items-center space-x-2">
                      <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                      <span>${Number(project.totalSpent).toLocaleString()} total spent</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {canSubmitProposal && (
              <Button 
                className="w-full border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition" 
                size="lg" onClick={() => setActiveTab("submit-proposal")} data-testid="submit-proposal-button">Submit Proposal
              </Button>
            )}

            {isProjectOwner && project.status === 'open' && (
              <Button variant="outline" onClick={() => setActiveTab("proposals")} data-testid="view-proposals-button"
                className="w-full border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition">
                <UserIcon className="mr-2 h-4 w-4" />View Proposals ({proposals.length})
              </Button>
            )}

            {(isProjectOwner || isAssignedFreelancer) && project.status === 'in_progress' && (
              <Button variant="outline" onClick={() => setActiveTab("messages")} data-testid="open-messages-button"
                className="w-full border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition">
                <MessageSquareIcon className="mr-2 h-4 w-4" />Open Messages
              </Button>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {canSubmitProposal && (
            <TabsContent value="submit-proposal" className="mt-6">
              <ProposalForm projectId={projectId} projectTitle={project.title} projectBudget={project.budget} />
            </TabsContent>
          )}

          {isProjectOwner && (
            <TabsContent value="proposals" className="mt-6">
              <ProposalList proposals={proposals} onAccept={acceptProposalMutation.mutateAsync} showActions={true} />
            </TabsContent>
          )}

          {project.status === 'in_progress' && (isProjectOwner || isAssignedFreelancer) && (
            <>
              <TabsContent value="milestones" className="mt-6">
                <MilestoneTracker projectId={projectId} showPaymentActions={isProjectOwner} />
              </TabsContent>

              <TabsContent value="messages" className="mt-6">
                <MessageProvider projectId={projectId}>
                  <ChatInterface projectId={projectId} receiverName={isProjectOwner ? "Assigned Freelancer" : "Client"}
                    receiverId={isProjectOwner ? project.freelancerId || '' : project.clientId} />
                </MessageProvider>
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Help Section (optional, for consistency) */}
        <div className="mt-12 rounded-lg p-8" style={{ background: "#ffe0b2" }}>
          <h2 className="text-xl font-semibold mb-4 text-center text-[var(--primary)]">Tips for Working with Freelancers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium">Communicate Clearly</h3>
              <p className="text-sm text-muted-foreground">
                Set clear expectations and maintain open communication throughout the project.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium">Review Proposals Carefully</h3>
              <p className="text-sm text-muted-foreground">
                Evaluate proposals based on experience, skills, and previous work.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium">Set Milestones</h3>
              <p className="text-sm text-muted-foreground">
                Break the project into milestones for better tracking and payment security.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium">Give Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Provide constructive feedback to help freelancers deliver their best work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
