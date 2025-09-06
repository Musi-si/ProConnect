import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults } from "@/components/search/search-results";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchIcon, FilterIcon, ArrowLeftIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "wouter";
import type { SearchFilters as SearchFiltersType } from "@/types";

export default function BrowseFreelancers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const pageSize = 12;

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.set('q', searchQuery);
  if (filters.skills?.length) queryParams.set('skills', filters.skills.join(','));
  if (filters.location) queryParams.set('location', filters.location);
  if (filters.minRating) queryParams.set('minRating', filters.minRating.toString());
  queryParams.set('limit', pageSize.toString());
  queryParams.set('offset', ((currentPage - 1) * pageSize).toString());

  const { data: freelancersData, isLoading } = useQuery({
    queryKey: ['/api/search/freelancers', queryParams.toString()],
  });

  const freelancers = freelancersData?.freelancers || [];
  const totalCount = freelancers.length; // In a real app, this would come from the API

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const FilterPanel = () => (
    <SearchFilters
      filters={filters}
      onFiltersChange={setFilters}
      onSearch={handleSearch}
      searchType="freelancers"
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-3xl font-bold text-[var(--primary)]">Browse Freelancers</h1>
            </div>
            <div className="flex-1" /> {/* Spacer for symmetry */}
          </div>
          <p className="text-muted-foreground text-center">
            Discover talented freelancers ready to work on your projects
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 bg-white/95 dark:bg-card/95 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search freelancers by name, skills, or expertise..."
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  data-testid="freelancer-search-input"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                  data-testid="search-freelancers"
                >
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Search
                </Button>

                {isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                        data-testid="mobile-filters"
                      >
                        <FilterIcon className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filter Freelancers</SheetTitle>
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
            <SearchResults
              results={freelancers}
              isLoading={isLoading}
              resultType="freelancers"
              totalCount={totalCount}
              onLoadMore={handleLoadMore}
              hasMore={freelancers.length >= pageSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
