import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeftIcon, 
  CameraIcon, 
  PlusIcon, 
  XIcon,
  SaveIcon,
  UserIcon,
  MapPinIcon,
  DollarSignIcon,
  LinkIcon
} from "lucide-react";
import { Link } from "wouter";
import { z } from "zod";
import { useEffect } from "react";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  bio: z.string().optional(),
  location: z.string().optional(),
  hourlyRate: z.string().optional(),
  avatar: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>(user?.portfolioLinks || []);
  const [newSkill, setNewSkill] = useState("");
  const [newPortfolioLink, setNewPortfolioLink] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
      location: user?.location || "",
      hourlyRate: user?.hourlyRate || "",
      avatar: user?.avatar || "",
    },
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        location: user.location || "",
        hourlyRate: user.hourlyRate || "",
        avatar: user.avatar || "",
      });
      setSkills(user.skills || []);
      setPortfolioLinks(user.portfolioLinks || []);
    }
  }, [user, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData & { skills: string[]; portfolioLinks: string[] }) => {
      const response = await apiRequest("PUT", "/api/users/profile", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      // Update the auth context with new user data
      queryClient.setQueryData(['/api/auth/me'], { user: data.user });
    },
    onError: (error: any) => {
      setError(error.message || "Failed to update profile. Please try again.");
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate({
      ...data,
      skills,
      portfolioLinks,
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addPortfolioLink = () => {
    if (newPortfolioLink.trim() && !portfolioLinks.includes(newPortfolioLink.trim())) {
      setPortfolioLinks([...portfolioLinks, newPortfolioLink.trim()]);
      setNewPortfolioLink("");
    }
  };

  const removePortfolioLink = (linkToRemove: string) => {
    setPortfolioLinks(portfolioLinks.filter(link => link !== linkToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-3xl font-bold text-[var(--primary)]">Edit Profile</h1>
            </div>
            <div className="flex-1" /> {/* Spacer for symmetry */}
          </div>
          <p className="text-muted-foreground text-center">
            Keep your profile up to date to attract the right opportunities
          </p>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card className="bg-white/95 dark:bg-card/95 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={form.watch('avatar')} alt="Profile" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {getInitials(form.watch('firstName'), form.watch('lastName'))}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                    data-testid="upload-avatar"
                  >
                    <CameraIcon className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                    data-testid="first-name-input"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                    data-testid="last-name-input"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell clients about your experience, skills, and what makes you unique..."
                  {...form.register("bio")}
                  data-testid="bio-textarea"
                />
                <p className="text-sm text-muted-foreground">
                  A compelling bio helps clients understand your expertise and decide to hire you.
                </p>
              </div>

              {/* Location and Rate */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., New York, USA"
                    {...form.register("location")}
                    data-testid="location-input"
                  />
                </div>
                {user.role === 'freelancer' && (
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate" className="flex items-center gap-2">
                      <DollarSignIcon className="h-4 w-4" />
                      Hourly Rate
                    </Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      placeholder="50"
                      {...form.register("hourlyRate")}
                      data-testid="hourly-rate-input"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          {user.role === 'freelancer' && (
            <Card className="bg-white/95 dark:bg-card/95 shadow-2xl">
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
                <CardDescription>
                  Add skills that showcase your expertise and help clients find you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Skills */}
                {skills.length > 0 && (
                  <div className="space-y-2">
                    <Label>Your Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {skill}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-auto p-0 hover:bg-transparent"
                            onClick={() => removeSkill(skill)}
                            data-testid={`remove-skill-${skill}`}
                          >
                            <XIcon className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Skills */}
                <div className="space-y-2">
                  <Label>Add Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, addSkill)}
                      placeholder="e.g., React.js, Node.js, Python"
                      data-testid="add-skill-input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                      onClick={addSkill}
                      disabled={!newSkill.trim()}
                      data-testid="add-skill-button"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Portfolio Links */}
          {user.role === 'freelancer' && (
            <Card className="bg-white/95 dark:bg-card/95 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Portfolio & Work Samples
                </CardTitle>
                <CardDescription>
                  Add links to your best work to showcase your abilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Links */}
                {portfolioLinks.length > 0 && (
                  <div className="space-y-2">
                    <Label>Portfolio Links</Label>
                    <div className="space-y-2">
                      {portfolioLinks.map((link, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded bg-white/90 dark:bg-card/90 shadow-inner">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[var(--primary)] hover:underline flex-1 truncate"
                          >
                            {link}
                          </a>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePortfolioLink(link)}
                            data-testid={`remove-portfolio-${index}`}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Links */}
                <div className="space-y-2">
                  <Label>Add Portfolio Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newPortfolioLink}
                      onChange={(e) => setNewPortfolioLink(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, addPortfolioLink)}
                      placeholder="https://yourportfolio.com"
                      type="url"
                      data-testid="add-portfolio-input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                      onClick={addPortfolioLink}
                      disabled={!newPortfolioLink.trim()}
                      data-testid="add-portfolio-button"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator className="border-t-2 border-[var(--primary)]/30 my-12" />

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Changes will be visible to clients immediately after saving.
            </p>
            <Button
              type="submit"
              className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
              disabled={updateProfileMutation.isPending}
              data-testid="save-profile"
            >
              {updateProfileMutation.isPending ? (
                "Saving..."
              ) : (
                <>
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
