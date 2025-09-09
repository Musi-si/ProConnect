import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { SearchFilters } from "@/components/search/search-filters";
import { ProjectList } from "@/components/projects/project-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchIcon, FilterIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { SearchFilters as SearchFiltersType } from "@/types";

export default function BrowseProjects() {
  console.log("BrowseProjects loaded");

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const pageSize = 12;

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.set('q', searchQuery);
  if (filters.category) queryParams.set('category', filters.category);
  if (filters.skills?.length) queryParams.set('skills', filters.skills.join(','));
  if (filters.budgetMin) queryParams.set('budgetMin', filters.budgetMin.toString());
  if (filters.budgetMax) queryParams.set('budgetMax', filters.budgetMax.toString());
  if (filters.timeline) queryParams.set('timeline', filters.timeline);
  queryParams.set('status', 'open'); // Only show open projects
  queryParams.set('limit', pageSize.toString());
  queryParams.set('offset', ((currentPage - 1) * pageSize).toString());

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['/api/projects', queryParams.toString()],
  });

  const projects = projectsData?.projects || [
    // Example mock project
    {
      id: "1",
      title: "Mock Project",
      description: "This is a mock project for development.",
      skills: ["React", "Node.js"],
      budget: 500,
      timeline: "1 week"
    }
  ];
  // Use the real total count if available from API, else fallback to projects.length
  const totalCount = projectsData?.totalCount ?? projects.length;

  // Reset to first page when searching
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // Reset to first page when filters change
  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    // This would be implemented to change the sort order
    console.log('Sort changed to:', sort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const FilterPanel = () => (
    <SearchFilters
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onSearch={handleSearch}
      searchType="projects"
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Projects</h1>
          <p className="text-muted-foreground">
            Find your next opportunity from thousands of available projects
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects by title, description, or skills..."
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  data-testid="project-search-input"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSearch} data-testid="search-projects">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Search
                </Button>
                
                {isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" data-testid="mobile-filters">
                        <FilterIcon className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filter Projects</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterPanel />
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Desktop */}
          {!isMobile && (
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={`${isMobile ? 'col-span-full' : 'lg:col-span-3'}`}>
            <div className="mb-4 text-muted-foreground text-sm">
              {isLoading
                ? "Loading projects..."
                : `Showing ${projects.length} of ${totalCount} projects`}
            </div>
            {/* Show a message if there is no backend or no data */}
            {!isLoading && (!projectsData || projects.length === 0) ? (
              <Card className="bg-white/95 dark:bg-card/95 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No projects available</h3>
                  <p className="text-muted-foreground mb-4">
                    There are currently no projects to display. This may be because the backend is not connected yet or the endpoint does not exist.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ProjectList
                projects={projects}
                isLoading={isLoading}
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onSortChange={handleSortChange}
                showClientInfo={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
