import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  StarIcon,
  MessageSquareIcon,
  ClockIcon,
  DollarSignIcon,
  CheckIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { useProposal } from "@/contexts/proposal-context";

interface ProposalListProps {
  proposals: Proposal[];
  onAccept?: (proposalId: string) => void;
  onReject?: (proposalId: string) => void;
  onMessage?: (proposalId: string) => void;
  showActions?: boolean;
}

export function ProposalList({
  proposals,
  onAccept,
  onReject,
  onMessage,
  showActions = true,
}: ProposalListProps) {
  const { isLoading, acceptProposal, deleteProposal } = useProposal();
  const { toast } = useToast();

  const handleAcceptProposal = async (proposal) => {
    try {
      if (!proposal.id || !proposal.projectId) return;

      await acceptProposal(proposal.projectId, proposal.id);

      toast({
        title: "Proposal Accepted",
        description: "You have successfully accepted the proposal.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to accept proposal.",
        variant: "destructive",
      });
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getInitials = (name: string, lastName: any) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getTimeAgo = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  const handleAccept = (proposalId: string) => {
    if (onAccept) return onAccept(proposalId);
    console.warn("No accept handler provided");
  };

  const handleReject = (proposalId: string) => {
    if (onReject) return onReject(proposalId);
    console.warn("No reject handler provided");
  };

  const handleMessage = (proposalId: string) => {
    if (onMessage) return onMessage(proposalId);
    alert("Messaging freelancer...");
  };

  if (isLoading) {
    return (
      <Card className="bg-white/95 dark:bg-card/95 shadow-lg">
        <CardContent className="p-8 text-center">Loading proposals...</CardContent>
      </Card>
    );
  }

  if (!proposals || proposals.length === 0) {
    return (
      <Card className="bg-white/95 dark:bg-card/95 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquareIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-[var(--primary)]">
            No proposals yet
          </h3>
          <p className="text-muted-foreground">
            Proposals will appear here once freelancers start submitting them.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        {proposals.length} proposal{proposals.length !== 1 ? "s" : ""} received
      </div>

      <div className="space-y-4">
        {proposals.map((proposal: any) => (
          <Card
            key={proposal.id}
            className="bg-white/95 dark:bg-card/95 shadow-lg hover:shadow-xl transition-shadow"
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={proposal.freelancer?.profilePicture || ""}
                        alt={`${proposal.freelancer?.firstName} ${proposal.freelancer?.lastName}`}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(proposal.freelancer?.firstName, proposal.freelancer?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-[var(--primary)]">
                        {proposal.freelancer?.firstName} {proposal.freelancer?.lastName}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <StarIcon className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                          <span>
                            {proposal.freelancer?.rating || "N/A"} (
                            {proposal.freelancer?.reviewCount || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={getStatusColor(proposal.status)}
                      variant="secondary"
                    >
                      {proposal.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {getTimeAgo(proposal.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Proposal Content */}
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-[var(--foreground)]">
                    {proposal.description}
                  </p>

                  {/* Budget & Timeline */}
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center text-primary font-semibold">
                      <DollarSignIcon className="h-4 w-4 mr-1" />
                      ${proposal.budget}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {proposal.proposedTimeline}
                    </div>
                  </div>

                  {/* Portfolio Samples */}
                  {proposal.portfolioSamples?.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[var(--primary)]">
                        Portfolio Examples:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(proposal.portfolioSamples) ? proposal.portfolioSamples : [proposal.portfolioSamples]).map(
                          (sample: string, index: number) => (
                            <a
                              key={index}
                              href={sample}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-primary hover:underline"
                            >
                              Example {index + 1}
                              <ExternalLinkIcon className="h-3 w-3 ml-1" />
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Questions */}
                  {proposal.questions && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[var(--primary)]">
                        Questions:
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        "{proposal.questions}"
                      </p>
                    </div>
                  )}

                  {/* Milestones */}
                  {proposal.milestones?.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[var(--primary)]">
                        Proposed Milestones:
                      </div>
                      <div className="space-y-2">
                        {(Array.isArray(proposal.milestones) ? proposal.milestones : [proposal.milestones]).map(
                          (milestone: any, index: number) => (
                            <div key={index} className="p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-[var(--foreground)]">
                                  {milestone.title}
                                </span>
                                <span className="text-sm font-semibold text-[var(--primary)]">
                                  ${milestone.amount}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {milestone.description}
                              </p>
                              <div className="text-xs text-muted-foreground mt-1">
                                Due: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : "N/A"}
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {showActions && proposal.status === "pending" && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMessage(proposal.id)}
                        disabled={isLoading}
                        data-testid={`message-freelancer-${proposal.id}`}
                      >
                        <MessageSquareIcon className="h-4 w-4 mr-2" />
                        Message
                      </Button>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          className="w-full border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                          // onClick={async () => {
                          //   try {
                          //     if (!proposal.id || !proposal.projectId) return;

                          //     await handleAcceptProposal(proposal.projectId, proposal.id);

                          //     toast({
                          //       title: "Proposal Accepted",
                          //       description: "You have successfully accepted the proposal.",
                          //     });
                          //   } catch (err: any) {
                          //     toast({
                          //       title: "Error",
                          //       description: err.message || "Failed to accept proposal.",
                          //       variant: "destructive",
                          //     });
                          //   }
                          // }}
                          onClick={() => handleAcceptProposal(proposal)}
                          disabled={isLoading}
                          data-testid={`accept-proposal-${proposal.id}`}
                        >
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Accept Proposal
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
