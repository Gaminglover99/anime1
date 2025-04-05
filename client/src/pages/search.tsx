import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import AnimeCard from "@/components/anime/anime-card";
import AnimeFilterSidebar from "@/components/filters/anime-filter-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Anime } from "@shared/schema";
import LoadingAnime from "@/components/ui/loading-anime";

type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

interface AnimeFilters {
  search?: string;
  genreId?: number;
  year?: string;
  status?: string;
  type?: string;
  order?: string;
  page: number;
  limit: number;
}

const SearchPage = () => {
  const [location] = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("q") || "";

  const [filters, setFilters] = useState<AnimeFilters>({
    search: searchQuery,
    page: 1,
    limit: 25,
  });
  
  // Track if any active search or filters are being applied
  const [hasActiveFilters, setHasActiveFilters] = useState(!!searchQuery);

  // Update filters when URL query changes
  useEffect(() => {
    // Get all query parameters from URL
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get("type");
    
    // Check if we have any active filters (search or type)
    const hasSearch = !!searchQuery && searchQuery.trim() !== '';
    const hasType = !!typeParam;
    setHasActiveFilters(hasSearch || hasType);
    
    // Update filters based on URL parameters
    setFilters(prevFilters => ({
      ...prevFilters,
      search: searchQuery,
      type: typeParam || undefined,
      page: 1, // Reset to first page when search changes
    }));
  }, [searchQuery, location]);

  const { data, isLoading, error } = useQuery<PaginatedResponse<Anime>, Error>({
    queryKey: ["/api/animes", filters],
    enabled: hasActiveFilters, // Only run the query if there are active filters
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      if (filters.search) {
        // Always set search parameter for any search query
        queryParams.set("search", filters.search);
        // We don't use the exact parameter anymore as all searches are title-only
      }
      
      if (filters.genreId) queryParams.set("genreId", filters.genreId.toString());
      if (filters.year) queryParams.set("year", filters.year);
      if (filters.status) queryParams.set("status", filters.status);
      if (filters.type) queryParams.set("type", filters.type);
      if (filters.order) queryParams.set("order", filters.order);
      queryParams.set("page", filters.page.toString());
      queryParams.set("limit", filters.limit.toString());
      
      const response = await fetch(`/api/animes?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch anime data");
      }
      
      return response.json();
    },
  });

  // Update URL when search term changes
  const updateSearchURL = (searchTerm: string | undefined | null) => {
    if (searchTerm) {
      // Update URL without triggering navigation
      const url = new URL(window.location.href);
      url.searchParams.set("q", searchTerm);
      window.history.replaceState({}, "", url.toString());
    } else {
      // Remove search param if empty
      const url = new URL(window.location.href);
      url.searchParams.delete("q");
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleFilterChange = (newFilters: AnimeFilters) => {
    // Check if any actual filters (besides pagination) are being applied
    const hasFilters = 
      !!newFilters.search || 
      !!newFilters.genreId || 
      !!newFilters.year || 
      !!newFilters.status || 
      !!newFilters.type || 
      !!newFilters.order;
    
    setHasActiveFilters(hasFilters);
    
    // Update URL if search term changed
    if (newFilters.search !== filters.search) {
      updateSearchURL(newFilters.search);
    }
    
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const goToPage = (pageNumber: number) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      page: pageNumber,
    }));
  };

  // Create array of page numbers to display
  const getPageNumbers = () => {
    if (!data) return [];
    
    const { page, totalPages } = data.pagination;
    let pageNumbers: (number | string)[] = [];
    
    if (totalPages <= 7) {
      pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (page <= 3) {
        pageNumbers = [1, 2, 3, 4, "...", totalPages];
      } else if (page >= totalPages - 2) {
        pageNumbers = [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pageNumbers = [1, "...", page - 1, page, page + 1, "...", totalPages];
      }
    }
    
    return pageNumbers;
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load anime data. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <AnimeFilterSidebar 
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {hasActiveFilters 
                  ? (searchQuery 
                    ? `Search Results: "${searchQuery}"` 
                    : filters.type === "Movie" 
                      ? "Anime Movies"
                      : filters.type === "TV" 
                        ? "TV Series" 
                        : "Filtered Results")
                  : "Search Anime"
                }
              </h1>
              <p className="text-gray-400">
                {hasActiveFilters && data?.pagination?.total ? `Found ${data.pagination.total} anime` : ""}
              </p>
            </div>

            {/* Grid of anime cards */}
            {!hasActiveFilters ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-xl mb-4">Use the search or filters to find anime</p>
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <ul className="mt-6 space-y-3 text-left text-gray-400">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Search by anime title</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Filter by genre, year, or status</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Try voice search for hands-free results</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingAnime text={`Searching for ${filters.search ? `"${filters.search}"` : "anime"}...`} size="lg" />
              </div>
            ) : (
              <>
                {data?.data?.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-xl mb-4">No anime found matching your criteria</p>
                    <Button 
                      onClick={() => {
                        // Get type from URL in case we're on Movies or TV Series page
                        const params = new URLSearchParams(window.location.search);
                        const typeParam = params.get("type");
                        
                        // Keep the type parameter but clear everything else
                        setFilters({ 
                          page: 1, 
                          limit: 25,
                          type: typeParam || undefined
                        });
                        
                        // Only reset hasActiveFilters if we don't have a type filter
                        setHasActiveFilters(!!typeParam);
                        
                        // Clear search parameters but preserve type
                        updateSearchURL(null);
                      }}
                      variant="outline"
                    >
                      Clear filters
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {data?.data?.map((anime) => (
                        <AnimeCard key={anime.id} anime={anime} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {data && data.pagination.totalPages > 1 && (
                      <div className="mt-12 flex justify-center">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => goToPage(data.pagination.page - 1)}
                            disabled={!data.pagination.hasPrevPage}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>

                          {getPageNumbers().map((pageNumber, i) => (
                            typeof pageNumber === "number" ? (
                              <Button
                                key={i}
                                variant={pageNumber === data.pagination.page ? "default" : "outline"}
                                className={pageNumber === data.pagination.page ? "bg-[#ff3a3a]" : ""}
                                onClick={() => goToPage(pageNumber)}
                              >
                                {pageNumber}
                              </Button>
                            ) : (
                              <span key={i} className="px-2">...</span>
                            )
                          ))}

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => goToPage(data.pagination.page + 1)}
                            disabled={!data.pagination.hasNextPage}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;