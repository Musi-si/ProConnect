import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  LinkIcon,
} from "lucide-react";
import { z } from "zod";

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
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");

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

  // Reset form whenever user changes
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

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: async (
      data: ProfileFormData & { skills: string[]; portfolioLinks: string[] }
    ) => {
      const response = await apiRequest("PUT", "/api/users/profile", {
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        location: data.location,
        hourlyRate: data.hourlyRate,
        avatar: data.avatar,
        skills: data.skills,
        portfolioLinks: data.portfolioLinks,
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      // Update user in cache
      queryClient.setQueryData(["/api/auth/me"], { user: data.user });
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

  const handleSubmit = async (data: ProfileFormData) => {
    let avatarUrl = data.avatar;

    // Upload image to Cloudinary if a new file is selected
    if (profilePictureFile) {
      const formData = new FormData();
      formData.append("file", profilePictureFile);
      formData.append("upload_preset", "profile_pics"); // replace with your preset

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/de9wmjkut/image/upload`, {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        avatarUrl = result.secure_url; // Cloudinary URL
      } catch (error) {
        toast({ title: "Upload failed", description: "Could not upload image", variant: "destructive" });
        return;
      }
    }

    updateProfileMutation.mutate({
      ...data,
      avatar: avatarUrl,
      skills,
      portfolioLinks,
    });
  };

  // Helpers for skills & portfolio links
  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };
  const addPortfolioLink = () => {
    if (newPortfolioLink.trim() && !portfolioLinks.includes(newPortfolioLink.trim())) {
      setPortfolioLinks([...portfolioLinks, newPortfolioLink.trim()]);
      setNewPortfolioLink("");
    }
  };
  const removePortfolioLink = (linkToRemove: string) => {
    setPortfolioLinks(portfolioLinks.filter((link) => link !== linkToRemove));
  };
  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };
  const getInitials = (firstName?: string, lastName?: string) =>
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

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
            <div className="flex-1" />
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
              {/* Profile */}
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={previewUrl} alt="Profile" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {getInitials(form.watch("firstName"), form.watch("lastName"))}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <label htmlFor="profilePicture" className="inline-flex items-center gap-2 cursor-pointer border border-gray-300 rounded px-3 py-1 hover:bg-gray-100">
                    <CameraIcon className="h-4 w-4" /> Change Photo
                  </label>
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        if (file.size > 5 * 1024 * 1024) {
                          toast({ title: "File too large", description: "Max file size is 5MB", variant: "destructive" });
                          return;
                        }
                        setProfilePictureFile(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 5MB.</p>
                </div>
              </div>

              {/* Names */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" {...form.register("firstName")} />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" {...form.register("lastName")} />
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
                <Textarea id="bio" rows={4} {...form.register("bio")} />
              </div>

              {/* Location & Rate */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" /> Location
                  </Label>
                  <Input id="location" {...form.register("location")} />
                </div>
                {user.role === "freelancer" && (
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate" className="flex items-center gap-2">
                      <DollarSignIcon className="h-4 w-4" /> Hourly Rate
                    </Label>
                    <Input id="hourlyRate" type="number" {...form.register("hourlyRate")} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          {user.role === "freelancer" && (
            <Card className="bg-white/95 dark:bg-card/95 shadow-2xl">
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1">
                        {skill}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 h-auto p-0"
                        >
                          <XIcon className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addSkill)}
                    placeholder="e.g., React.js, Node.js"
                  />
                  <Button type="button" variant="outline" onClick={addSkill} disabled={!newSkill.trim()}>
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Portfolio Links */}
          {user.role === "freelancer" && (
            <Card className="bg-white/95 dark:bg-card/95 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" /> Portfolio & Work Samples
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {portfolioLinks.length > 0 && (
                  <div className="space-y-2">
                    {portfolioLinks.map((link, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 rounded bg-white/90 dark:bg-card/90 shadow-inner"
                      >
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <a href={link} target="_blank" className="text-sm text-[var(--primary)] flex-1 truncate">
                          {link}
                        </a>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removePortfolioLink(link)}>
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={newPortfolioLink}
                    onChange={(e) => setNewPortfolioLink(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addPortfolioLink)}
                    placeholder="https://yourportfolio.com"
                    type="url"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPortfolioLink}
                    disabled={!newPortfolioLink.trim()}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
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
            >
              {updateProfileMutation.isPending ? "Saving..." : <><SaveIcon className="mr-2 h-4 w-4" /> Save Changes</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
