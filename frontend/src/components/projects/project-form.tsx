import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { insertProjectSchema } from "@shared/schema";
import { PlusIcon, XIcon, UploadIcon, LoaderIcon } from "lucide-react";
import { z } from "zod";

const projectFormSchema = insertProjectSchema.omit({ clientId: true });

interface ProjectFormProps {
  onSubmit: (data: z.infer<typeof projectFormSchema>) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<z.infer<typeof projectFormSchema>>;
}

const categories = [
  "Web Development",
  "Mobile Development", 
  "Design & Creative",
  "Writing & Translation",
  "Digital Marketing",
  "Data Science",
  "DevOps & Cloud",
  "AI & Machine Learning",
];

const timelines = [
  "Less than 1 week",
  "1-2 weeks", 
  "1 month",
  "2-3 months",
  "More than 3 months",
];

export function ProjectForm({ onSubmit, isLoading, initialData }: ProjectFormProps) {
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      budget: initialData?.budget || "",
      budgetType: initialData?.budgetType || "fixed",
      timeline: initialData?.timeline || "",
      skills: skills,
      attachments: initialData?.attachments || [],
      ...initialData,
    },
  });

  const handleSubmit = async (data: z.infer<typeof projectFormSchema>) => {
    try {
      setError("");
      await onSubmit({ ...data, skills });
    } catch (err: any) {
      setError(err.message || "Failed to save project. Please try again.");
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      form.setValue("skills", updatedSkills);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
    form.setValue("skills", updatedSkills);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white/95 dark:bg-card/95 shadow-2xl">
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>
          Provide detailed information about your project to attract the right freelancers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Build a responsive e-commerce website"
              {...form.register("title")}
              disabled={isLoading}
              data-testid="project-title-input"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={form.watch("category")} 
              onValueChange={(value) => form.setValue("category", value)}
              disabled={isLoading}
            >
              <SelectTrigger
                data-testid="project-category-select"
                className="bg-white dark:bg-card/80 border border-orange-300 text-orange-900 dark:text-white"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="backdrop-blur-md bg-white/80 dark:bg-card/80 shadow-lg">
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              rows={6}
              placeholder="Describe your project requirements in detail..."
              {...form.register("description")}
              disabled={isLoading}
              data-testid="project-description-textarea"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Budget and Timeline */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget *</Label>
              <Input
                id="budget"
                type="number"
                placeholder="Enter budget amount"
                {...form.register("budget")}
                disabled={isLoading}
                data-testid="project-budget-input"
              />
              {form.formState.errors.budget && (
                <p className="text-sm text-destructive">{form.formState.errors.budget.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline *</Label>
              <Select 
                value={form.watch("timeline")} 
                onValueChange={(value) => form.setValue("timeline", value)}
                disabled={isLoading}
              >
              <SelectTrigger
                data-testid="project-category-select"
                className="bg-white dark:bg-card/80 border border-orange-300 text-orange-900 dark:text-white"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
                <SelectContent className="backdrop-blur-md bg-white/80 dark:bg-card/80 shadow-lg">
                  {timelines.map((timeline) => (
                    <SelectItem
                      key={timeline}
                      value={timeline}
                      className="hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      {timeline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.timeline && (
                <p className="text-sm text-destructive">{form.formState.errors.timeline.message}</p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Required Skills</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 hover:bg-transparent"
                    onClick={() => removeSkill(skill)}
                    disabled={isLoading}
                    data-testid={`remove-skill-${skill}`}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add skills (e.g., React.js, Node.js)"
                disabled={isLoading}
                data-testid="add-skill-input"
              />
              <Button
                type="button"
                variant="outline"
                className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                onClick={addSkill}
                disabled={!newSkill.trim() || isLoading}
                data-testid="add-skill-button"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* File Attachments */}
          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <div className="bg-white/90 dark:bg-card/90 shadow-inner rounded-lg p-8 text-center">
              <UploadIcon className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Drop files here or click to upload</p>
              <p className="text-xs text-muted-foreground">
                Supports: PDF, DOC, PNG, JPG (Max 50MB)
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                disabled={isLoading}
                data-testid="upload-files-button"
              >
                Choose Files
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Posting fee: $25 (charged upon successful project completion)
            </p>
            <Button
              type="submit"
              className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
              disabled={isLoading || form.formState.isSubmitting}
              data-testid="submit-project-button"
            >
              {isLoading || form.formState.isSubmitting ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Posting Project...
                </>
              ) : (
                "Post Project"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
