import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { ProjectForm } from "@/components/projects/project-form";
import { useAuth } from "@/contexts/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useEffect } from "react";

export default function CreateProject() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
    if (!isLoading && isAuthenticated && user?.role !== 'client') {
      setLocation("/dashboard");
      toast({
        title: "Access Denied",
        description: "Only clients can create projects.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, isLoading, user, setLocation, toast]);

  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Project Created!",
        description: "Your project has been posted successfully.",
      });
      setLocation(`/projects/${data.project.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Project",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'client') {
    return null;
  }

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
                  className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                >
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <div className="flex-1 flex justify-center">
              <h1 className="text-3xl font-bold text-[var(--primary)]">Post a New Project</h1>
            </div>
            <div className="flex-1" /> {/* Spacer for symmetry */}
          </div>
          <p className="text-muted-foreground text-center">
            Describe your project in detail to attract the right freelancers
          </p>
        </div>

        {/* Project Creation Form */}
        <ProjectForm
          onSubmit={createProjectMutation.mutateAsync}
          isLoading={createProjectMutation.isPending}
        />
        
        {/* Help Section */}
        <div className="mt-12 rounded-lg p-8" style={{ background: "#ffe0b2" }}>
          <h2 className="text-xl font-semibold mb-4 text-center text-[var(--primary)]">Tips for a Great Project Post</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium">Be Specific</h3>
              <p className="text-sm text-muted-foreground">
                Clearly describe what you need, including specific requirements, deliverables, and timeline expectations.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium">Set Realistic Budget</h3>
              <p className="text-sm text-muted-foreground">
                Research market rates and set a fair budget that reflects the complexity and value of your project.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium">Include Examples</h3>
              <p className="text-sm text-muted-foreground">
                Provide examples, mockups, or references to help freelancers understand your vision better.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium">List Required Skills</h3>
              <p className="text-sm text-muted-foreground">
                Tag all relevant skills and technologies to help the right freelancers find your project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
