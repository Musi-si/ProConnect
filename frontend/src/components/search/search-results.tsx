import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import {
  StarIcon,
  MapPinIcon,
  ClockIcon,
  DollarSignIcon,
  UserIcon,
  BriefcaseIcon,
  SearchIcon
} from "lucide-react";
import type { User, Project } from "@shared/schema";

// ✅ import your contexts
import { useProject } from "@/contexts/project-context";
// (assuming you also have a user/freelancer context)
import { useUser } from "@/contexts/user-context";

interface SearchResultsProps {
  resultType: "freelancers" | "projects";
  searchQuery?: string;
  filters?: Record<string, any>;
}

export function SearchResults({
  resultType,
  searchQuery,
  filters,
}: SearchResultsProps) {
  // ✅ fetch from context instead of props
  const {
    projects,
    isLoading: projectsLoading,
    totalCount: projectCount,
    fetchMore: fetchMoreProjects,
    hasMore: hasMoreProjects,
  } = useProject({ searchQuery, filters });

  const {
    users,
    isLoading: usersLoading,
    totalCount: userCount,
    fetchMore: fetchMoreUsers,
    hasMore: hasMoreUsers,
  } = useUser({ searchQuery, filters });

  const isLoading = resultType === "projects" ? projectsLoading : usersLoading;
  const results: (Project | User)[] =
    resultType === "projects" ? projects : users;
  const totalCount = resultType === "projects" ? projectCount : userCount;
  const onLoadMore =
    resultType === "projects" ? fetchMoreProjects : fetchMoreUsers;
  const hasMore =
    resultType === "projects" ? hasMoreProjects : hasMoreUsers;

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase();

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  // ✅ Loading skeleton
  if (isLoading && results.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4 animate-pulse" />
                    <Skeleton className="h-4 w-full animate-pulse" />
                    <Skeleton className="h-4 w-2/3 animate-pulse" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-5 w-16 animate-pulse" />
                      <Skeleton className="h-5 w-16 animate-pulse" />
                      <Skeleton className="h-5 w-16 animate-pulse" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // ✅ No results
  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <SearchIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No results found</h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search criteria or browse all {resultType}.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href={
              resultType === "projects"
                ? "/projects/browse"
                : "/freelancers/browse"
            }
          >
            <Button
              variant="outline"
              className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition font-semibold"
              data-testid="browse-all"
            >
              Browse All{" "}
              {resultType === "projects" ? "Projects" : "Freelancers"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Render results
  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {results.length} of {totalCount} {resultType}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {results.map((result) =>
          resultType === "freelancers" ? (
            // 🔹 Freelancer card
            <FreelancerCard key={(result as User).id} freelancer={result as User} />
          ) : (
            // 🔹 Project card
            <ProjectCard key={(result as Project).id} project={result as Project} formatTimeAgo={formatTimeAgo} />
          )
        )}
      </div>

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className="text-center py-6">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoading}
            data-testid="load-more-results"
          >
            {isLoading
              ? "Loading..."
              : `Load More ${
                  resultType === "projects" ? "Projects" : "Freelancers"
                }`}
          </Button>
        </div>
      )}
    </div>
  );
}

// ✅ Extracted mini-cards (cleaner)
function FreelancerCard({ freelancer }: { freelancer: User }) {
  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={freelancer.avatar} alt={freelancer.username} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {getInitials(`${freelancer.firstName} ${freelancer.lastName}`)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Link href={`/freelancers/${freelancer.id}`}>
              <h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">
                {freelancer.firstName} {freelancer.lastName}
              </h3>
            </Link>
            {/* ...same as your original */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectCard({ project, formatTimeAgo }: { project: Project; formatTimeAgo: (date: string | Date) => string }) {
  return (
    <Card className="hover:shadow-md transition-shadow bg-white/95 dark:bg-card/95 shadow-2xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Link href={`/projects/${project.id}`}>
              <h3 className="font-semibold hover:text-primary transition-colors cursor-pointer">
                {project.title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {project.description?.slice(0, 120)}...
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.skills?.slice(0, 5).map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-muted-foreground">
            <span className="flex items-center">
              <DollarSignIcon className="h-3 w-3 mr-1" />${project.budget}
            </span>
            <span className="flex items-center">
              <ClockIcon className="h-3 w-3 mr-1" />{project.timeline}
            </span>
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
  );
}
