import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, XIcon, LoaderIcon, InfoIcon } from "lucide-react";
import { useProposal } from "@/contexts/proposal-context";
import { useAuth } from "@/contexts/auth-context";

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

interface ProposalFormData {
  description: string;
  proposedBudget: string;
  proposedTimeline: string;
  questions?: string;
}

const timelines = [
  "Less than 1 week",
  "1-2 weeks", 
  "1 month",
  "2-3 months",
  "More than 3 months",
];

export function ProposalForm({ projectId, projectTitle, projectBudget }: ProposalFormProps) {
  const { submitProposal, isLoading } = useProposal();
  const { user } = useAuth();

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([]);
  const [newPortfolioLink, setNewPortfolioLink] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const form = useForm<ProposalFormData>({
    defaultValues: {
      description: "",
      proposedBudget: "",
      proposedTimeline: "",
      questions: "",
    },
  });

  const handleSubmit = async (data: ProposalFormData) => {
    try {
      setError("");

      if (!user?.id) throw new Error("User not logged in");

      const parsedBudget = Number(data.proposedBudget);
      if (isNaN(parsedBudget) || parsedBudget <= 0) throw new Error("Budget must be a valid number");

      await submitProposal(projectId, {
        description: data.description,
        budget: parsedBudget,
        proposedTimeline: data.proposedTimeline,
        questions: data.questions || null,
        projectId: Number(projectId),
        freelancerId: user.id,
        milestones,
        portfolioSamples: portfolioLinks,
      });

      toast({
        title: "Proposal Submitted!",
        description: "Your proposal has been sent successfully."
      })

      form.reset();
      setMilestones([]);
      setPortfolioLinks([]);
    } catch (err: any) {
      toast({
        title: "Failed to Submit Proposal",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
      setError(err.message || "Failed to submit proposal.");
    }
  };

  const addMilestone = () => setMilestones([...milestones, { title: "", description: "", amount: 0, dueDate: "" }]);
  const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };
  const removeMilestone = (index: number) => setMilestones(milestones.filter((_, i) => i !== index));

  const addPortfolioLink = () => {
    const link = newPortfolioLink.trim();
    if (link && !portfolioLinks.includes(link)) {
      setPortfolioLinks([...portfolioLinks, link]);
      setNewPortfolioLink("");
    }
  };
  const removePortfolioLink = (linkToRemove: string) =>
    setPortfolioLinks(portfolioLinks.filter(link => link !== linkToRemove));

  const totalMilestoneAmount = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);

  return (
    <Card className="max-w-3xl mx-auto bg-white/95 dark:bg-card/95 shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle>Submit Proposal</CardTitle>
        <CardDescription>
          Craft a compelling proposal for "{projectTitle}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="rounded-lg">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="description">Cover Letter *</Label>
            <Textarea
              id="description"
              rows={6}
              placeholder="Explain why you're the perfect fit for this project..."
              {...form.register("description", { required: "Description is required" })}
              className="border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Budget & Timeline */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="proposedBudget">Proposed Budget *</Label>
              <Input
                id="proposedBudget"
                type="number"
                placeholder="Enter your budget"
                {...form.register("proposedBudget", {
                  required: "Budget is required",
                  min: { value: 1, message: "Budget must be greater than 0" },
                  valueAsNumber: true,
                })}
                className="border border-border rounded-lg focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              {form.formState.errors.proposedBudget && (
                <p className="text-sm text-destructive">{form.formState.errors.proposedBudget.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="proposedTimeline">Delivery Timeline *</Label>
              <Select
                value={form.watch("proposedTimeline")}
                onValueChange={(value) => form.setValue("proposedTimeline", value)}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="proposedTimeline"
                  className="bg-white dark:bg-card/80 border border-border text-[var(--foreground)] dark:text-white"
                >
                  <SelectValue placeholder="Select a delivery timeline" />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-md bg-white/80 dark:bg-card/80 shadow-lg">
                  {timelines.map((timeline) => (
                    <SelectItem
                      key={timeline}
                      value={timeline}
                      className="hover:bg-primary hover:text-white transition-colors"
                    >
                      {timeline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.proposedTimeline && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.proposedTimeline.message}
                </p>
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
                className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                onClick={addMilestone}
                disabled={isLoading}
              >
                <PlusIcon className="h-4 w-4" /> Add Milestone
              </Button>
            </div>
            {milestones.map((milestone, index) => (
              <Card key={index} className="p-4 rounded-2xl shadow-lg border border-border">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Milestone {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(index)}
                    disabled={isLoading}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, "title", e.target.value)}
                      placeholder="Design Phase"
                      className="border border-border rounded-lg focus:ring-2 focus:ring-primary"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount ($)</Label>
                    <Input
                      type="number"
                      value={milestone.amount || ""}
                      onChange={(e) =>
                        updateMilestone(index, "amount", parseFloat(e.target.value) || 0)
                      }
                      placeholder="Amount"
                      className="border border-border rounded-lg focus:ring-2 focus:ring-primary"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={milestone.description}
                    onChange={(e) => updateMilestone(index, "description", e.target.value)}
                    placeholder="Describe deliverables"
                    className="border border-border rounded-lg focus:ring-2 focus:ring-primary"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2 mt-4">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={milestone.dueDate}
                    onChange={(e) => updateMilestone(index, "dueDate", e.target.value)}
                    className="border border-border rounded-lg focus:ring-2 focus:ring-primary"
                    disabled={isLoading}
                  />
                </div>
              </Card>
            ))}
            {totalMilestoneAmount > 0 && (
              <div className="p-3 bg-primary/10 rounded-lg flex items-center gap-2 text-primary">
                <InfoIcon className="h-4 w-4" />
                Total milestone amount: ${totalMilestoneAmount}
              </div>
            )}
          </div>

          {/* Portfolio Links */}
          <div className="space-y-2">
            <Label>Portfolio Samples</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {portfolioLinks.map((link, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1 rounded-full">
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
                placeholder="Add portfolio link"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                onClick={addPortfolioLink}
                disabled={!newPortfolioLink.trim() || isLoading}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Additional Questions */}
          <div className="space-y-2">
            <Label htmlFor="questions">Questions / Notes (Optional)</Label>
            <Textarea
              id="questions"
              rows={3}
              placeholder="Any questions for the client?"
              {...form.register("questions")}
              className="border border-border rounded-lg focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Proposal submission fee: $0 (free to submit)
            </p>
            <Button
              type="submit"
              className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
              disabled={isLoading || form.formState.isSubmitting}
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
