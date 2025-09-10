import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { insertProposalSchema, type InsertProposal } from "@shared/schema";
import { useProposal } from "@/contexts/proposal-context";
import { PlusIcon, XIcon, LoaderIcon, InfoIcon } from "lucide-react";
import { z } from "zod";
// import { submitProposal } from "../../utils/proposals";
import { useAuth } from "@/contexts/auth-context";

const proposalFormSchema = insertProposalSchema.omit({
  projectId: true,
  freelancerId: true,
});

interface Milestone {
  title: string;
  description: string;
  amount: number;
  dueDate: string;
}

interface ProposalFormProps {
  projectId: string;
  projectTitle: string;
  projectBudget: string;
}

export function ProposalForm({ projectId, projectTitle, projectBudget }: ProposalFormProps) {
  const { submitProposal, isLoading } = useProposal();
  const { user } = useAuth();

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([]);
  const [newPortfolioLink, setNewPortfolioLink] = useState("");
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof proposalFormSchema>>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      coverLetter: "",
      proposedBudget: "",
      proposedTimeline: "",
      milestones: [],
      portfolioSamples: [],
      questions: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof proposalFormSchema>) => {
    try {
      setError("");

      if (!user?.id) throw new Error("User not logged in");

      // Ensure budget is a number
      const parsedBudget = Number(data.proposedBudget);
      if (isNaN(parsedBudget)) throw new Error("Invalid budget");

      await submitProposal(projectId, {
        description: data.coverLetter || "No description provided", // map coverLetter to description
        coverLetter: data.coverLetter,
        proposedBudget: parsedBudget,
        proposedTimeline: data.proposedTimeline,
        questions: data.questions || null,
        projectId: Number(projectId),
        freelancerId: user.id,
        milestones: milestones || [],
        portfolioSamples: portfolioLinks || [],
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit proposal. Please try again.");
    }
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { title: "", description: "", amount: 0, dueDate: "" },
    ]);
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const addPortfolioLink = () => {
    const link = newPortfolioLink.trim();
    if (link && !portfolioLinks.includes(link)) {
      setPortfolioLinks([...portfolioLinks, link]);
      setNewPortfolioLink("");
    }
  };

  const removePortfolioLink = (linkToRemove: string) => {
    setPortfolioLinks(portfolioLinks.filter(link => link !== linkToRemove));
  };

  const totalMilestoneAmount = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Proposal</CardTitle>
        <CardDescription>
          Craft a compelling proposal for "{projectTitle}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Project Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">Project Details</h3>
            <p className="text-sm text-muted-foreground mb-1">Title: {projectTitle}</p>
            <p className="text-sm text-muted-foreground">Client Budget: ${projectBudget}</p>
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter *</Label>
            <Textarea
              id="coverLetter"
              rows={6}
              placeholder="Explain why you're the perfect fit for this project..."
              {...form.register("coverLetter")}
              disabled={isLoading}
              data-testid="cover-letter-textarea"
            />
            {form.formState.errors.coverLetter && (
              <p className="text-sm text-destructive">{form.formState.errors.coverLetter.message}</p>
            )}
          </div>

          {/* Budget and Timeline */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="proposedBudget">Your Proposed Budget *</Label>
              <Input
                id="proposedBudget"
                type="number"
                placeholder="Enter your budget"
                {...form.register("proposedBudget")}
                disabled={isLoading}
                data-testid="proposed-budget-input"
              />
              {form.formState.errors.proposedBudget && (
                <p className="text-sm text-destructive">{form.formState.errors.proposedBudget.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposedTimeline">Delivery Timeline *</Label>
              <Input
                id="proposedTimeline"
                placeholder="e.g., 2 weeks, 1 month"
                {...form.register("proposedTimeline")}
                disabled={isLoading}
                data-testid="proposed-timeline-input"
              />
              {form.formState.errors.proposedTimeline && (
                <p className="text-sm text-destructive">{form.formState.errors.proposedTimeline.message}</p>
              )}
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Project Milestones (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMilestone}
                disabled={isLoading}
                data-testid="add-milestone-button"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Milestone
              </Button>
            </div>

            {milestones.length > 0 && (
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium">Milestone {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMilestone(index)}
                        disabled={isLoading}
                        data-testid={`remove-milestone-${index}`}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Milestone Title</Label>
                        <Input
                          value={milestone.title}
                          onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                          placeholder="e.g., Design Phase"
                          disabled={isLoading}
                          data-testid={`milestone-title-${index}`}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Amount ($)</Label>
                        <Input
                          type="number"
                          value={milestone.amount || ''}
                          onChange={(e) => updateMilestone(index, 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="Amount"
                          disabled={isLoading}
                          data-testid={`milestone-amount-${index}`}
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={3}
                          value={milestone.description}
                          onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                          placeholder="Describe the deliverables"
                          disabled={isLoading}
                          data-testid={`milestone-description-${index}`}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Input
                          type="date"
                          value={milestone.dueDate}
                          onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                          disabled={isLoading}
                          data-testid={`milestone-date-${index}`}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                
                {totalMilestoneAmount > 0 && (
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <InfoIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        Total milestone amount: ${totalMilestoneAmount}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Portfolio Links */}
          <div className="space-y-2">
            <Label>Relevant Portfolio Examples</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {portfolioLinks.map((link, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Portfolio {index + 1}
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 hover:bg-transparent"
                    onClick={() => removePortfolioLink(link)}
                    disabled={isLoading}
                    data-testid={`remove-portfolio-${index}`}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newPortfolioLink}
                onChange={(e) => setNewPortfolioLink(e.target.value)}
                placeholder="Add portfolio URL"
                disabled={isLoading}
                data-testid="portfolio-link-input"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addPortfolioLink}
                disabled={!newPortfolioLink.trim() || isLoading}
                data-testid="add-portfolio-button"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-2">
            <Label htmlFor="questions">Questions for the Client (Optional)</Label>
            <Textarea
              id="questions"
              rows={4}
              placeholder="Any questions or clarifications you need?"
              {...form.register("questions")}
              disabled={isLoading}
              data-testid="questions-textarea"
            />
          </div>

          <Separator />

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              <InfoIcon className="h-4 w-4 inline mr-1" />
              Your proposal will be visible to the client immediately
            </div>
            <Button
              type="submit"
              disabled={isLoading || form.formState.isSubmitting}
              data-testid="submit-proposal-button"
            >
              {isLoading || form.formState.isSubmitting ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Proposal"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}