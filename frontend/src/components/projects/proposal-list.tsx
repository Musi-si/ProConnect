import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  StarIcon, 
  MessageSquareIcon, 
  ClockIcon, 
  DollarSignIcon,
  CheckIcon,
  XIcon,
  ExternalLinkIcon
} from "lucide-react";
import type { Proposal } from "@shared/schema";

interface ProposalListProps {
  proposals: Proposal[];
  onAccept?: (proposalId: string) => void;
  onReject?: (proposalId: string) => void;
  onMessage?: (proposalId: string) => void;
  isLoading?: boolean;
  showActions?: boolean;
}

export function ProposalList({ 
  proposals, 
  onAccept, 
  onReject, 
  onMessage,
  isLoading,
  showActions = true
}: ProposalListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getTimeAgo = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  if (!proposals || proposals.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquareIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No proposals yet</h3>
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
        {proposals.length} proposal{proposals.length !== 1 ? 's' : ''} received
      </div>
      
      <div className="space-y-4">
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" alt="Freelancer" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials("Freelancer Name")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Freelancer Name</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <StarIcon className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                          <span>4.9 (47 reviews)</span>
                        </div>
                        <span>•</span>
                        <span>23 projects completed</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(proposal.status)} variant="secondary">
                      {proposal.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {getTimeAgo(proposal.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Proposal Content */}
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed">{proposal.coverLetter}</p>
                  
                  {/* Budget & Timeline */}
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center text-primary font-semibold">
                      <DollarSignIcon className="h-4 w-4 mr-1" />
                      ${proposal.proposedBudget}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {proposal.proposedTimeline}
                    </div>
                  </div>

                  {/* Portfolio Samples */}
                  {proposal.portfolioSamples && proposal.portfolioSamples.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Portfolio Examples:</div>
                      <div className="flex flex-wrap gap-2">
                        {proposal.portfolioSamples.map((sample: string, index: number) => (
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
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Questions */}
                  {proposal.questions && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Questions:</div>
                      <p className="text-sm text-muted-foreground italic">
                        "{proposal.questions}"
                      </p>
                    </div>
                  )}

                  {/* Milestones */}
                  {proposal.milestones && proposal.milestones.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Proposed Milestones:</div>
                      <div className="space-y-2">
                        {proposal.milestones.map((milestone: any, index: number) => (
                          <div key={index} className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{milestone.title}</span>
                              <span className="text-sm font-semibold">${milestone.amount}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{milestone.description}</p>
                            <div className="text-xs text-muted-foreground mt-1">
                              Due: {new Date(milestone.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {showActions && proposal.status === 'pending' && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMessage?.(proposal.id)}
                        disabled={isLoading}
                        data-testid={`message-freelancer-${proposal.id}`}
                      >
                        <MessageSquareIcon className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReject?.(proposal.id)}
                          disabled={isLoading}
                          data-testid={`reject-proposal-${proposal.id}`}
                        >
                          <XIcon className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onAccept?.(proposal.id)}
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
