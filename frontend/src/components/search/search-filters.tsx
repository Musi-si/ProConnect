import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FilterIcon,
  XIcon,
  SearchIcon,
  MapPinIcon,
  StarIcon,
  DollarSignIcon
} from "lucide-react";
import type { SearchFilters } from "@/types";

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  searchType?: "projects" | "freelancers";
}

const categories = [
  "Web Development",
  "Mobile Development",
  "Design & Creative",
  "Writing & Translation",
  "Digital Marketing",
  "Data Science",
  "DevOps & Cloud",
  "AI & Machine Learning",
];

const timelines = [
  "Less than 1 week",
  "1-2 weeks",
  "1 month",
  "2-3 months",
  "More than 3 months",
];

export function SearchFilters({
  filters,
  onFiltersChange,
  onSearch,
  searchType = "projects",
}: SearchFiltersProps) {
  const [budgetRange, setBudgetRange] = useState<[number, number]>([
    filters.budgetMin || 0,
    filters.budgetMax || 10000,
  ]);
  const [skillInput, setSkillInput] = useState("");

  // For dual-range slider
  const minBudget = 0;
  const maxBudget = 10000;
  const step = 100;
  const rangeRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;
    const currentSkills = filters.skills || [];
    if (!currentSkills.includes(skill)) {
      handleFilterChange("skills", [...currentSkills, skill]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    const currentSkills = filters.skills || [];
    handleFilterChange("skills", currentSkills.filter((s) => s !== skill));
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Dual range slider logic
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), budgetRange[1] - step);
    setBudgetRange([newMin, budgetRange[1]]);
    handleFilterChange("budgetMin", newMin);
    handleFilterChange("budgetMax", budgetRange[1]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), budgetRange[0] + step);
    setBudgetRange([budgetRange[0], newMax]);
    handleFilterChange("budgetMin", budgetRange[0]);
    handleFilterChange("budgetMax", newMax);
  };

  const clearFilters = () => {
    onFiltersChange({});
    setBudgetRange([minBudget, maxBudget]);
    setSkillInput("");
  };

  const activeFilterCount = Object.keys(filters).filter((key) => {
    const value = filters[key as keyof SearchFilters];
    return value && (Array.isArray(value) ? value.length > 0 : true);
  }).length;

  // For slider background fill
  useEffect(() => {
    if (rangeRef.current) {
      const percent1 =
        ((budgetRange[0] - minBudget) / (maxBudget - minBudget)) * 100;
      const percent2 =
        ((budgetRange[1] - minBudget) / (maxBudget - minBudget)) * 100;
      rangeRef.current.style.background = `linear-gradient(to right, #e5e7eb ${percent1}%, var(--primary) ${percent1}%, var(--primary) ${percent2}%, #e5e7eb ${percent2}%)`;
    }
  }, [budgetRange]);

  return (
    <Card className="bg-white/95 dark:bg-card/95 shadow-2xl border-[var(--primary)]/30 border-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[var(--primary)]">
            <FilterIcon className="h-5 w-5" />
            Filters
          </span>
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-[var(--primary)]/10 text-[var(--primary)] border-none"
              >
                {activeFilterCount} active
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                data-testid="clear-filters"
                className="hover:bg-[var(--primary)]/10"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Refine your search to find exactly what you need.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Category Filter */}
        {searchType === "projects" && (
          <div className="space-y-2">
            <Label className="text-[var(--primary)]">Category</Label>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) =>
                handleFilterChange("category", value === "all" ? undefined : value)
              }
            >
              <SelectTrigger
                data-testid="category-filter"
                className="border-[var(--primary)]/30"
              >
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Skills Filter as text input */}
        <div className="space-y-3">
          <Label className="text-[var(--primary)]">Skills</Label>
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillInputKeyDown}
              placeholder="Type a skill and press Enter"
              data-testid="skills-input"
              className="border-[var(--primary)]/30"
            />
            <Button
              type="button"
              onClick={handleAddSkill}
              disabled={!skillInput.trim()}
              variant="outline"
              className="border-[var(--primary)] text-[var(--primary)]"
            >
              Add
            </Button>
          </div>
          {filters.skills && filters.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {filters.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-xs text-foreground bg-[var(--primary)]/10 border-none"
                >
                  {skill}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 hover:bg-transparent"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator className="border-t-2 border-[var(--primary)]/20" />

        {/* Budget Range */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-[var(--primary)]">
            <DollarSignIcon className="h-4 w-4" />
            Budget Range
          </Label>
          <div className="px-3">
            <div className="relative flex items-center" style={{ height: 40 }}>
              <input
                type="range"
                min={minBudget}
                max={maxBudget}
                step={step}
                value={budgetRange[0]}
                onChange={handleMinChange}
                className="absolute w-full pointer-events-none h-2 opacity-0"
                style={{ zIndex: 2 }}
                data-testid="budget-range-min"
              />
              <input
                type="range"
                min={minBudget}
                max={maxBudget}
                step={step}
                value={budgetRange[1]}
                onChange={handleMaxChange}
                className="absolute w-full pointer-events-none h-2 opacity-0"
                style={{ zIndex: 3 }}
                data-testid="budget-range-max"
              />
              <div
                ref={rangeRef}
                className="w-full h-2 rounded bg-gray-200 relative"
                style={{ zIndex: 1 }}
              />
              {/* Thumbs */}
              <div
                className="absolute top-1/2 left-0"
                style={{
                  transform: `translateX(${
                    ((budgetRange[0] - minBudget) / (maxBudget - minBudget)) * 100
                  }%) translateY(-50%)`,
                  zIndex: 4,
                }}
              >
                <div className="w-4 h-4 rounded-full bg-[var(--primary)] border-2 border-white shadow" />
              </div>
              <div
                className="absolute top-1/2 left-0"
                style={{
                  transform: `translateX(${
                    ((budgetRange[1] - minBudget) / (maxBudget - minBudget)) * 100
                  }%) translateY(-50%)`,
                  zIndex: 4,
                }}
              >
                <div className="w-4 h-4 rounded-full bg-[var(--primary)] border-2 border-white shadow" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <span>${budgetRange[0].toLocaleString()}</span>
              <span>${budgetRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Timeline Filter (Projects only) */}
        {searchType === "projects" && (
          <div className="space-y-2">
            <Label className="text-[var(--primary)]">Timeline</Label>
            <Select
              value={filters.timeline || "any"}
              onValueChange={(value) =>
                handleFilterChange("timeline", value === "any" ? undefined : value)
              }
            >
              <SelectTrigger
                data-testid="timeline-filter"
                className="border-[var(--primary)]/30"
              >
                <SelectValue placeholder="Any timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any timeline</SelectItem>
                {timelines.map((timeline) => (
                  <SelectItem key={timeline} value={timeline}>
                    {timeline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Location Filter (Freelancers only) */}
        {searchType === "freelancers" && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[var(--primary)]">
              <MapPinIcon className="h-4 w-4" />
              Location
            </Label>
            <Input
              value={filters.location || ""}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              placeholder="Enter location"
              data-testid="location-filter"
              className="border-[var(--primary)]/30"
            />
          </div>
        )}

        {/* Rating Filter (Freelancers only) */}
        {searchType === "freelancers" && (
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-[var(--primary)]">
              <StarIcon className="h-4 w-4" />
              Minimum Rating
            </Label>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`rating-${rating}`}
                    name="minRating"
                    checked={filters.minRating === rating}
                    onChange={() => handleFilterChange("minRating", rating)}
                    data-testid={`rating-filter-${rating}`}
                    className="accent-[var(--primary)]"
                  />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{rating}+</span>
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-3 w-3 ${
                            i < rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </Label>
                </div>
              ))}
              {/* Option to clear rating */}
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="rating-clear"
                  name="minRating"
                  checked={filters.minRating === undefined}
                  onChange={() => handleFilterChange("minRating", undefined)}
                  className="accent-[var(--primary)]"
                />
                <Label
                  htmlFor="rating-clear"
                  className="text-sm cursor-pointer text-muted-foreground"
                >
                  Any rating
                </Label>
              </div>
            </div>
          </div>
        )}

        <Separator className="border-t-2 border-[var(--primary)]/20" />

        {/* Apply Filters Button */}
        <Button
          onClick={onSearch}
          className="w-full bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition-colors"
          data-testid="apply-filters"
        >
          <SearchIcon className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
