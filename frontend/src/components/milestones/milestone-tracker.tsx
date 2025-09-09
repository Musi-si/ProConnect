import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";
import { 
  CheckCircleIcon, 
  ClockIcon, 
  DollarSignIcon, 
  AlertCircleIcon,
  FileTextIcon,
  CalendarIcon,
  CreditCardIcon
} from "lucide-react";
import type { Milestone } from "@shared/schema";

interface MilestoneTrackerProps {
  projectId: string;
  showPaymentActions?: boolean;
}

export function MilestoneTracker({ projectId, showPaymentActions = false }: MilestoneTrackerProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: milestonesData, isLoading } = useQuery({
    queryKey: ['/api/projects', projectId, 'milestones'],
  });

  const approveMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      const response = await apiRequest("PUT", `/api/milestones/${milestoneId}/approve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'milestones'] });
    },
  });

  const createPaymentIntentMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      const response = await apiRequest("POST", `/api/milestones/${milestoneId}/payment-intent`);
      return response.json();
    },
    onSuccess: (data, milestoneId) => {
      // In a real app, this would integrate with Stripe Elements
      console.log('Payment intent created:', data.clientSecret);
      // For now, we'll simulate successful payment
      setTimeout(() => {
        confirmPaymentMutation.mutate(milestoneId);
      }, 1000);
    },
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      const response = await apiRequest("POST", `/api/milestones/${milestoneId}/confirm-payment`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'milestones'] });
    },
  });

  const milestones: Milestone[] = milestonesData?.milestones || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in_review':
        return <AlertCircleIcon className="h-5 w-5 text-orange-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_review':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'in_review':
        return 'In Review';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const completedMilestones = milestones.filter(m => m.paidAt);
  const totalBudget = milestones.reduce((sum, m) => sum + parseFloat(m.amount), 0);
  const paidAmount = completedMilestones.reduce((sum, m) => sum + parseFloat(m.amount), 0);
  const progressPercentage = totalBudget > 0 ? Math.round((paidAmount / totalBudget) * 100) : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (milestones.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            Project Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <FileTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No milestones set</h3>
          <p className="text-muted-foreground">
            Milestones will be created when a proposal is accepted.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5" />
              Project Progress
            </span>
            <Badge variant="secondary" className="text-sm">
              {progressPercentage}% Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">${totalBudget.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground">Total Budget</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">${paidAmount.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground">Paid Out</div>
            </div>
            <div>
              <div className="text-lg font-bold">{completedMilestones.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold">{milestones.length - completedMilestones.length}</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones List */}
      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-border bg-background flex items-center justify-center">
                    {getStatusIcon(milestone.status)}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{milestone.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(milestone.status)} variant="secondary">
                          {getStatusText(milestone.status)}
                        </Badge>
                        <span className="text-sm font-semibold text-primary">
                          ${milestone.amount}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {milestone.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4 text-muted-foreground">
                        <span className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
                        </span>
                        {milestone.approvedAt && (
                          <span className="flex items-center text-green-600">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Approved {new Date(milestone.approvedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      {showPaymentActions && user?.role === 'client' && (
                        <div className="flex items-center space-x-2">
                          {milestone.status === 'in_review' && (
                            <Button
                              size="sm"
                              onClick={() => approveMutation.mutate(milestone.id)}
                              disabled={approveMutation.isPending}
                              data-testid={`approve-milestone-${milestone.id}`}
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          
                          {milestone.status === 'approved' && !milestone.paidAt && (
                            <Button
                              size="sm"
                              onClick={() => createPaymentIntentMutation.mutate(milestone.id)}
                              disabled={createPaymentIntentMutation.isPending || confirmPaymentMutation.isPending}
                              data-testid={`pay-milestone-${milestone.id}`}
                            >
                              <CreditCardIcon className="h-4 w-4 mr-1" />
                              {createPaymentIntentMutation.isPending || confirmPaymentMutation.isPending ? 'Processing...' : 'Pay Now'}
                            </Button>
                          )}
                          
                          {milestone.paidAt && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <DollarSignIcon className="h-3 w-3 mr-1" />
                              Paid
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {milestone.deliverables && milestone.deliverables.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Deliverables:</div>
                        <div className="space-y-1">
                          {milestone.deliverables.map((deliverable: string, idx: number) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <FileTextIcon className="h-3 w-3" />
                              <span>{deliverable}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {index < milestones.length - 1 && (
                  <div className="absolute left-5 top-12 w-px h-6 bg-border"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
