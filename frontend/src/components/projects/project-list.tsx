import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard } from "./project-card";
import { ChevronLeftIcon, ChevronRightIcon, GridIcon, ListIcon } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectListProps {
  projects: Project[];
  isLoading?: boolean;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (sort: string) => void;
  showClientInfo?: boolean;
}

export function ProjectList({ 
  projects, 
  isLoading, 
  totalCount = 0,
  currentPage = 1,
  pageSize = 12,
  onPageChange,
  onSortChange,
  showClientInfo = false
}: ProjectListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  const sortOptions = [
    { value: 'newest', label: 'Most Recent' },
    { value: 'budget-high', label: 'Highest Budget' },
    { value: 'budget-low', label: 'Lowest Budget' },
    { value: 'proposals', label: 'Most Proposals' },
    { value: 'deadline', label: 'Deadline' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <GridIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No projects found</h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search criteria or check back later for new projects.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {projects.length} of {totalCount} projects
        </div>
        <div className="flex items-center space-x-4">
          {onSortChange && (
            <Select
              onValueChange={onSortChange}
              value={sortOptions[0]?.value} // always set a valid initial value
            >
              <SelectTrigger className="w-40" data-testid="sort-select">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
              data-testid="grid-view"
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
              data-testid="list-view"
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Project Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
      }>
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            showClientInfo={showClientInfo}
          />
        ))}
      </div>

      {/* Pagination */}
      {onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrev}
            data-testid="prev-page"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  data-testid={`page-${pageNum}`}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext}
            data-testid="next-page"
          >
            Next
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
