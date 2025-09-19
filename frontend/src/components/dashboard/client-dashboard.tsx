import { useAuth } from "@/contexts/auth-context"; // ✅ add this import
import { useProject } from "@/contexts/project-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  StarIcon,
  DollarSignIcon,
  ClockIcon,
  BriefcaseIcon,
  PlusIcon,
} from "lucide-react";
import type { Project } from "@shared/schema";

export function ClientDashboard() {
  const { projects, stats } = useProject();
  const { user } = useAuth(); // ✅ logged-in client

  const recentProjects = projects.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-orange-600 text-primary-foreground p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user.username}!</h1>
            <p className="opacity-90">Ready to hire top talent for your projects?</p>
          </div>
          <div className="flex items-center space-x-6 text-center">
            {/* <div>
              <div className="text-2xl font-bold">{stats?.activeProjects || 0}</div>
              <div className="text-sm opacity-90">Active Projects</div>
            </div> */}
            <div>
              <div className="text-2xl font-bold">${user.totalSpent || '0'}</div>
              <div className="text-sm opacity-90">Total Spent</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="space-y-6">
          <Card className="bg-white/95 dark:bg-card/95 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Profile Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-3 flex items-center justify-center">
                  <StarIcon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="font-semibold text-lg">
                  {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Client"}
                </div>

                {user.bio && (
                  <div className="text-m text-muted-foreground mt-1">
                    {user.bio}
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  Client since {user ? new Date(user.createdAt).getFullYear() : "N/A"}
                </div>

                <div className="space-y-3 mt-3">
                  {user.location && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium">{user.location || 0}</span>
                    </div>
                  )}
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Projects Posted</span>
                    <span className="font-medium">{user?.projectsPosted || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Projects</span>
                    <span className="font-medium">{user?.activeProjects || 0}</span>
                  </div> */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Spent</span>
                    <span className="font-medium">
                      ${user?.totalSpent ? parseFloat(user.totalSpent).toLocaleString() : "0"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/profile/edit">
                  <Button
                    variant="outline"
                    className="w-full border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                  >
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Projects</h2>
            </div>

            {recentProjects.length === 0 ? (
              <Card className="bg-white/95 dark:bg-card/95 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <BriefcaseIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">Post a project to get started</p>
                  <Link href="/projects/create">
                    <Button
                      variant="outline"
                      className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Post Project
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project: Project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow bg-white/95 dark:bg-card/95 shadow-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Link href={`/projects/${project.id}`}>
                            <h3 className="font-semibold hover:text-primary transition-colors cursor-pointer">{project.title}</h3>
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {project.description.slice(0, 120)}...
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(Array.isArray(project.skills) ? project.skills : []).slice(0, 5).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-muted-foreground">
                          <span className="flex items-center"><DollarSignIcon className="h-3 w-3 mr-1" />${project.budget}</span>
                          <span className="flex items-center"><ClockIcon className="h-3 w-3 mr-1" />{project.timeline}</span>
                        </div>
                        <Link href={`/projects/${project.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
