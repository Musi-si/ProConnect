import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard } from "./project-card";
import { ChevronLeftIcon, ChevronRightIcon, GridIcon, ListIcon } from "lucide-react";
import type { Project } from "@shared/schema";
import type { SearchFilters } from "@/types";

interface ProjectListProps {
  projects: Project[];
  filters?: SearchFilters;
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
  filters,
  isLoading, 
  totalCount = 0,
  currentPage = 1,
  pageSize = 12,
  onPageChange,
  onSortChange,
  showClientInfo = false
}: ProjectListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortValue, setSortValue] = useState<string>("newest");

  const filteredProjects = useMemo(() => {
    let results = projects;
    if (filters) {
      if (filters.category) results = results.filter(p => p.category === filters.category);
      if (filters.skills && filters.skills.length) {
        results = results.filter(p => filters.skills!.every(skill => p.skills.includes(skill)));
      }
      if (filters.budgetMin !== undefined && filters.budgetMax !== undefined) {
        results = results.filter(p => p.budget >= filters.budgetMin! && p.budget <= filters.budgetMax!);
      }
      if (filters.timeline) results = results.filter(p => p.timeline === filters.timeline);
    }
    return results;
  }, [projects, filters]);

  const sortedProjects = useMemo(() => {
    let results = [...filteredProjects];
    switch (sortValue) {
      case "budget-high": results.sort((a,b)=>b.budget - a.budget); break;
      case "budget-low": results.sort((a,b)=>a.budget - b.budget); break;
      case "deadline": results.sort((a,b)=>new Date(a.deadline).getTime() - new Date(b.deadline).getTime()); break;
      case "proposals": results.sort((a,b)=>b.proposalsCount - a.proposalsCount); break;
      default: results.sort((a,b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }
    return results;
  }, [filteredProjects, sortValue]);

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
          <Skeleton className="h-6 w-32 animate-pulse" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-40 animate-pulse" />
            <Skeleton className="h-10 w-20 animate-pulse" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-white/95 dark:bg-card/95 shadow-2xl">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4 animate-pulse" />
                <Skeleton className="h-16 w-full animate-pulse" />
                <div className="flex space-x-2">
                  <Skeleton className="h-5 w-16 animate-pulse" />
                  <Skeleton className="h-5 w-16 animate-pulse" />
                  <Skeleton className="h-5 w-16 animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24 animate-pulse" />
                  <Skeleton className="h-8 w-32 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!sortedProjects.length) {
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
      {/* Header with sort + view toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {sortedProjects.length} of {totalCount} projects
        </div>
        <div className="flex items-center space-x-4">
          <Select
            onValueChange={(val) => { setSortValue(val); onSortChange?.(val); }}
            value={sortValue}
          >
            <SelectTrigger
              className="w-40 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
              data-testid="sort-select"
            >
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="bg-white/95 dark:bg-card/95 shadow-2xl">
              {sortOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center border border-[var(--primary)] rounded-md bg-white/95 dark:bg-card/95 shadow-2xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`rounded-r-none border-none text-[var(--primary)] transition
                ${viewMode === 'grid' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--background)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'}`}
              data-testid="grid-view"
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={`rounded-l-none border-none text-[var(--primary)] transition
                ${viewMode === 'list' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--background)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'}`}
              data-testid="list-view"
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Project Grid/List */}
      <div className={viewMode === 'grid' ? "grid md:grid-cols-1 lg:grid-cols-2 gap-8" : "space-y-6"}>
        {sortedProjects.map(p => (
          <ProjectCard key={p.id} project={p} showClientInfo={showClientInfo} />
        ))}
      </div>

      {/* Pagination */}
      {onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage-1)} disabled={!hasPrev}>
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Previous
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) pageNum = i + 1;
            else if (currentPage <= 3) pageNum = i + 1;
            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = currentPage - 2 + i;

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage+1)} disabled={!hasNext}>
            Next <ChevronRightIcon className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
