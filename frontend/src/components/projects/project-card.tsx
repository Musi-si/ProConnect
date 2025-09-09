import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  ClockIcon, 
  DollarSignIcon, 
  UserIcon, 
  CalendarIcon,
  MapPinIcon,
  StarIcon 
} from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  showClientInfo?: boolean;
}

export function ProjectCard({ project, showClientInfo = false }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getTimeAgo = (date: Date | string) => {
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

  // Mock proposal count for display
  const proposalCount = Math.floor(Math.random() * 20) + 1;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 group">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link href={`/projects/${project.id}`}>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                  {project.title}
                </h3>
              </Link>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs capitalize">
                  {project.category}
                </Badge>
                <Badge className={getStatusColor(project.status)} variant="secondary">
                  {getStatusText(project.status)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm line-clamp-3">
            {project.description}
          </p>

          {/* Skills */}
          {project.skills && project.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.skills.slice(0, 4).map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {project.skills.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.skills.length - 4} more
                </Badge>
              )}
            </div>
          )}

          {/* Project Details */}
          <div className="space-y-2">
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
                <span className="flex items-center">
                  <UserIcon className="h-3 w-3 mr-1" />
                  {proposalCount} proposals
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3 mr-1" />
                Posted {getTimeAgo(project.createdAt)}
              </div>
              
              {showClientInfo && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <div className="w-4 h-4 bg-primary rounded-full mr-2 flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-medium">C</span>
                  </div>
                  <span>Client Rating: </span>
                  <StarIcon className="h-3 w-3 ml-1 text-yellow-500 fill-current" />
                  <span className="ml-1">4.8</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
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
            
            {project.status === 'in_progress' && (
              <Link href={`/messages?project=${project.id}`}>
                <Button variant="outline" size="sm" data-testid={`message-client-${project.id}`}>
                  Message Client
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
