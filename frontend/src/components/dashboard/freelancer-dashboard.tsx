import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { 
  SearchIcon, 
  FolderIcon,
  StarIcon,
  DollarSignIcon,
  EyeIcon,
  ClockIcon,
  BriefcaseIcon
} from "lucide-react";
import type { Project, Proposal } from "@shared/schema";

export function FreelancerDashboard() {
  const { data: projectsData } = useQuery({
    queryKey: ['/api/projects', { status: 'open' }],
  });

  const { data: proposalsData } = useQuery({
    queryKey: ['/api/my-proposals'],
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/freelancer-stats'],
  });

  const recentProjects = projectsData?.projects?.slice(0, 3) || [];
  const recentProposals = proposalsData?.proposals?.slice(0, 3) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // The Find Work sidebar link goes to /projects/browse
  const browseProjectsHref = "/projects/browse";
  // The My Proposals sidebar link goes to /dashboard?tab=proposals
  const myProposalsHref = "/dashboard?tab=proposals";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-orange-600 text-primary-foreground p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user.username}!</h1>
            <p className="opacity-90">Ready to find your next great project?</p>
          </div>
          <div className="flex items-center space-x-6 text-center">
            <div>
              <div className="text-2xl font-bold">{recentProposals.length}</div>
              <div className="text-sm opacity-90">Active Bids</div>
            </div>
            <div>
              <div className="text-2xl font-bold">${stats?.monthlyEarnings || '0'}</div>
              <div className="text-sm opacity-90">This Month</div>
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
                <div className="font-semibold text-lg">4.9 Rating</div>
                <div className="text-sm text-muted-foreground">Based on 47 reviews</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Profile Views</span>
                  <span className="font-medium">234 this week</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Response Rate</span>
                  <span className="font-medium text-green-600">95%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Projects Done</span>
                  <span className="font-medium">{stats?.completedProjects || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Earned</span>
                  <span className="font-medium">${stats?.totalEarnings || '0'}</span>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/profile/edit">
                  <Button
                    variant="outline"
                    className="w-full border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                    data-testid="edit-profile-button"
                  >
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Opportunities & Proposals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Opportunities */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Opportunities</h2>
              <Link href={browseProjectsHref}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                >
                  View All
                </Button>
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <Card className="bg-white/95 dark:bg-card/95 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <BriefcaseIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No projects available</h3>
                  <p className="text-muted-foreground mb-4">
                    Check back later for new opportunities
                  </p>
                  <Link href={browseProjectsHref}>
                    <Button
                      variant="outline"
                      className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                      data-testid="browse-all-projects"
                    >
                      <SearchIcon className="mr-2 h-4 w-4" />
                      Browse Projects
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
                            <h3 className="font-semibold hover:text-primary transition-colors cursor-pointer">
                              {project.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {project.description.slice(0, 120)}...
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.skills.slice(0, 3).map((skill: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-muted-foreground">
                          <span className="flex items-center">
                            <DollarSignIcon className="h-3 w-3 mr-1" />
                            ${project.budget}
                          </span>
                          <span className="flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {project.timeline}
                          </span>
                        </div>
                        <Link href={`/projects/${project.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                            data-testid={`view-project-${project.id}`}
                          >
                            Submit Proposal
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* My Proposals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Recent Proposals</h2>
              <Link href={myProposalsHref}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                >
                  View All
                </Button>
              </Link>
            </div>

            {recentProposals.length === 0 ? (
              <Card className="bg-white/95 dark:bg-card/95 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <FolderIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No proposals yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start submitting proposals to win projects
                  </p>
                  <Link href={browseProjectsHref}>
                    <Button
                      variant="outline"
                      className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                      data-testid="submit-first-proposal"
                    >
                      <SearchIcon className="mr-2 h-4 w-4" />
                      Find Projects
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {recentProposals.map((proposal: any) => (
                  <Card key={proposal.id} className="hover:shadow-md transition-shadow bg-white/95 dark:bg-card/95 shadow-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold">Project Proposal</h3>
                          <p className="text-sm text-muted-foreground">
                            ${proposal.proposedBudget} • {proposal.proposedTimeline}
                          </p>
                        </div>
                        <Badge className={getStatusColor(proposal.status)} variant="secondary">
                          {proposal.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {proposal.coverLetter.slice(0, 120)}...
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Submitted {new Date(proposal.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" data-testid={`view-proposal-${proposal.id}`}>
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </div>
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
