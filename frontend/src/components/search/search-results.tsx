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

interface SearchResultsProps {
  results: (User | Project)[];
  isLoading?: boolean;
  resultType: 'freelancers' | 'projects';
  totalCount?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function SearchResults({
  results,
  isLoading,
  resultType,
  totalCount = 0,
  onLoadMore,
  hasMore = false
}: SearchResultsProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

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
          <Link href={resultType === 'projects' ? '/projects/browse' : '/freelancers/browse'}>
            <Button
              variant="outline"
              className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition font-semibold"
              data-testid="browse-all"
            >
              Browse All {resultType === 'projects' ? 'Projects' : 'Freelancers'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
        {results.map((result) => {
          if (resultType === 'freelancers') {
            const freelancer = result as User;
            return (
              <Card key={freelancer.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={freelancer.avatar} alt={freelancer.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {getInitials(`${freelancer.firstName} ${freelancer.lastName}`)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/freelancers/${freelancer.id}`}>
                            <h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">
                              {freelancer.firstName} {freelancer.lastName}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">@{freelancer.username}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {parseFloat(freelancer.rating) > 0 && (
                            <div className="flex items-center space-x-1">
                              <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{freelancer.rating}</span>
                              <span className="text-sm text-muted-foreground">({freelancer.reviewCount})</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {freelancer.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {freelancer.bio}
                        </p>
                      )}

                      {freelancer.skills && freelancer.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {freelancer.skills.slice(0, 6).map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs text-foreground">
                              {skill}
                            </Badge>
                          ))}
                          {freelancer.skills.length > 6 && (
                            <Badge variant="secondary" className="text-xs text-foreground">
                              +{freelancer.skills.length - 6} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {freelancer.location && (
                            <span className="flex items-center">
                              <MapPinIcon className="h-3 w-3 mr-1" />
                              {freelancer.location}
                            </span>
                          )}
                          {freelancer.hourlyRate && (
                            <span className="flex items-center">
                              <DollarSignIcon className="h-3 w-3 mr-1" />
                              ${freelancer.hourlyRate}/hr
                            </span>
                          )}
                          <span className="flex items-center">
                            <BriefcaseIcon className="h-3 w-3 mr-1" />
                            ${freelancer.totalEarnings} earned
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          <Link href={`/freelancers/${freelancer.id}`}>
                            <Button variant="outline" size="sm" data-testid={`view-freelancer-${freelancer.id}`}>
                              View Profile
                            </Button>
                          </Link>
                          <Button size="sm" data-testid={`contact-freelancer-${freelancer.id}`}>
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          } else {
            const project = result as Project;
            const proposalCount = Math.floor(Math.random() * 15) + 1;

            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={`/projects/${project.id}`}>
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer line-clamp-2">
                            {project.title}
                          </h3>
                        </Link>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {project.category}
                          </Badge>
                          <Badge
                            className={
                              project.status === 'open'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }
                            variant="secondary"
                          >
                            {project.status === 'open' ? 'Open' : project.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {project.description}
                    </p>

                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.skills.slice(0, 5).map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs text-foreground">
                            {skill}
                          </Badge>
                        ))}
                        {project.skills.length > 5 && (
                          <Badge variant="secondary" className="text-xs text-foreground">
                            +{project.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center font-semibold text-primary">
                          <DollarSignIcon className="h-3 w-3 mr-1" />
                          ${project.budget}
                        </span>
                        <span className="flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {project.timeline}
                        </span>
                        <span className="flex items-center">
                          <UserIcon className="h-3 w-3 mr-1" />
                          {proposalCount} proposals
                        </span>
                        <span className="text-xs">
                          Posted {formatTimeAgo(project.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-primary-foreground font-medium">C</span>
                        </div>
                        <span>Client • 4.8★ rating</span>
                      </div>

                      <div className="flex space-x-2">
                        <Link href={`/projects/${project.id}`}>
                          <Button variant="outline" size="sm" data-testid={`view-project-${project.id}`}>
                            View Details
                          </Button>
                        </Link>
                        {project.status === 'open' && (
                          <Link href={`/projects/${project.id}`}>
                            <Button size="sm" data-testid={`submit-proposal-${project.id}`}>
                              Submit Proposal
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }
        })}
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
            {isLoading ? 'Loading...' : `Load More ${resultType === 'projects' ? 'Projects' : 'Freelancers'}`}
          </Button>
        </div>
      )}
    </div>
  );
}
