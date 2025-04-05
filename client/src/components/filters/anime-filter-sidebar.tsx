import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Mic, X } from "lucide-react";
import { Genre, Anime } from "@shared/schema";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { eventBus } from "@/lib/event-bus";

interface AnimeFilterSidebarProps {
  onFilterChange: (filters: AnimeFilters) => void;
  initialFilters?: Partial<AnimeFilters>;
}

export interface AnimeFilters {
  search?: string;
  genreId?: number;
  year?: string;
  status?: string;
  type?: string;
  order?: string;
  page: number;
  limit: number;
}

const AnimeFilterSidebar = ({ onFilterChange, initialFilters = {} }: AnimeFilterSidebarProps) => {
  const [searchValue, setSearchValue] = useState(initialFilters.search || "");
  const [genreId, setGenreId] = useState<string>(initialFilters.genreId?.toString() || "all");
  const [year, setYear] = useState<string>(initialFilters.year || "All");
  const [status, setStatus] = useState<string>(initialFilters.status || "All");
  const [type, setType] = useState<string>(initialFilters.type || "All");
  const [order, setOrder] = useState<string>(initialFilters.order || "Default");
  const [isListening, setIsListening] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Anime[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize from URL/props when component mounts
  useEffect(() => {
    if (initialFilters.search) {
      setSearchValue(initialFilters.search);
    }
    if (initialFilters.genreId) {
      setGenreId(initialFilters.genreId.toString());
    }
    if (initialFilters.year) {
      setYear(initialFilters.year);
    }
    if (initialFilters.status) {
      setStatus(initialFilters.status);
    }
    if (initialFilters.type) {
      setType(initialFilters.type);
    }
    if (initialFilters.order) {
      setOrder(initialFilters.order);
    }
  }, [initialFilters]);
  
  // Subscribe to reset events
  useEffect(() => {
    const unsubscribe = eventBus.subscribe('reset-filters', () => {
      setSearchValue("");
      setGenreId("all");
      setYear("All");
      setStatus("All");
      setType("All");
      setOrder("Default");
      setSuggestions([]);
      setSearchOpen(false);
      
      // Apply the reset filters
      onFilterChange({ 
        page: 1, 
        limit: initialFilters.limit || 25 
      });
    });
    
    return () => {
      unsubscribe();
    };
  }, [initialFilters]);
  
  // Fetch genres
  const { data: genresResponse } = useQuery<{data: Genre[]}>({
    queryKey: ["/api/genres"],
  });
  const genres = genresResponse?.data || [];
  
  // Fetch all animes for suggestions
  const { data: allAnimesResponse } = useQuery<{data: Anime[]}>({
    queryKey: ["/api/animes"],
  });
  
  // Update suggestions when search value changes - title-only search
  useEffect(() => {
    if (searchValue && searchValue.length > 2 && allAnimesResponse?.data) {
      const searchLower = searchValue.toLowerCase().trim();
      
      // Filter by title matches only
      const filtered = allAnimesResponse.data.filter(anime => 
        anime.title.toLowerCase().includes(searchLower)
      );
      
      // Sort by relevance - exact matches first, then starts with, then includes
      const sortedResults = filtered.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        
        // Exact match gets highest priority
        if (titleA === searchLower && titleB !== searchLower) return -1;
        if (titleB === searchLower && titleA !== searchLower) return 1;
        
        // Starts with gets second priority
        if (titleA.startsWith(searchLower) && !titleB.startsWith(searchLower)) return -1;
        if (titleB.startsWith(searchLower) && !titleA.startsWith(searchLower)) return 1;
        
        // Otherwise alphabetical
        return titleA.localeCompare(titleB);
      }).slice(0, 5);
      
      setSuggestions(sortedResults);
      setSearchOpen(sortedResults.length > 0);
    } else {
      setSuggestions([]);
      setSearchOpen(false);
    }
  }, [searchValue, allAnimesResponse?.data]);
  
  const handleFilterApply = () => {
    const currentFilters = {
      ...(initialFilters as AnimeFilters), // Include page and limit from parent
      search: searchValue && searchValue.trim() !== '' ? searchValue.trim() : undefined,
      genreId: genreId && genreId !== "all" ? parseInt(genreId) : undefined,
      year: year !== "All" ? year : undefined,
      status: status !== "All" ? status : undefined,
      type: type !== "All" ? type : undefined,
      order: order !== "Default" ? order : undefined,
    };
    
    // Ensure page and limit are always present
    if (!currentFilters.page) currentFilters.page = 1;
    if (!currentFilters.limit) currentFilters.limit = 25;
    
    onFilterChange(currentFilters);
  };
  
  // Voice search functionality
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(true);
      // @ts-ignore - These APIs might not be in the TypeScript definitions
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchValue(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert("Voice search is not supported in your browser");
    }
  };
  
  // Apply filters whenever a filter changes
  useEffect(() => {
    handleFilterApply();
  }, [genreId, year, status, type, order]);
  
  // Generate years from 1980 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => (currentYear - i).toString());
  
  return (
    <div className="w-full bg-[#1a1a1a] rounded-lg overflow-hidden">
      <div className="bg-[#ff3a3a] py-2 px-3">
        <h2 className="text-sm font-bold text-white">Filters</h2>
      </div>
      
      <div className="p-3 space-y-3">
        {/* Search Box with Autocomplete */}
        <div>
          <div className="relative">
            <Input 
              ref={searchInputRef}
              type="text"
              placeholder="Search anime..."
              className="bg-[#222] border-gray-700 w-full h-9 pl-3 pr-16 text-white text-sm"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterApply()}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
              {searchValue && (
                <button 
                  onClick={() => {
                    setSearchValue("");
                    setSuggestions([]);
                    setSearchOpen(false);
                    // Apply the empty search value
                    onFilterChange({
                      ...initialFilters as AnimeFilters,
                      search: undefined,
                      page: 1,
                    });
                  }}
                  className="p-1 rounded-full text-gray-400 hover:text-white mr-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button 
                onClick={startVoiceSearch}
                className={`p-1 mr-1 rounded-full ${isListening ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                onClick={handleFilterApply}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Autocomplete Dropdown - Made more compact */}
          {searchOpen && suggestions.length > 0 && (
            <div className="absolute z-50 max-w-[250px] w-full mt-1 bg-[#222] rounded-md border border-gray-700 overflow-hidden shadow-lg">
              <div className="max-h-48 overflow-auto">
                {suggestions.map((anime) => (
                  <div 
                    key={anime.id}
                    className="flex items-center p-1.5 hover:bg-[#333] cursor-pointer"
                    onClick={() => {
                      setSearchValue(anime.title);
                      setSearchOpen(false);
                      handleFilterApply();
                    }}
                  >
                    <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 mr-2">
                      <img 
                        src={anime.coverImage || ''} 
                        alt={anime.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32x32?text=NA';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs truncate">{anime.title}</div>
                      <div className="text-gray-400 text-[10px] flex">
                        <span>{anime.type}</span>
                        <span className="mx-1">•</span>
                        <span>{anime.releaseYear}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Two column layout for more compact design */}
        <div className="grid grid-cols-2 gap-2">
          {/* Genre Filter */}
          <div>
            <label className="text-white text-xs font-medium mb-1 block">Genre</label>
            <Select value={genreId} onValueChange={setGenreId}>
              <SelectTrigger className="bg-[#222] border-gray-700 text-white h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-[#222] border-gray-700 text-white">
                <SelectItem value="all">All</SelectItem>
                {genres?.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id.toString()}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Year Filter */}
          <div>
            <label className="text-white text-xs font-medium mb-1 block">Year</label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="bg-[#222] border-gray-700 text-white h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto bg-[#222] border-gray-700 text-white">
                <SelectItem value="All">All</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="text-white text-xs font-medium mb-1 block">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-[#222] border-gray-700 text-white h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-[#222] border-gray-700 text-white">
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Type Filter */}
          <div>
            <label className="text-white text-xs font-medium mb-1 block">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-[#222] border-gray-700 text-white h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-[#222] border-gray-700 text-white">
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="TV">TV</SelectItem>
                <SelectItem value="Movie">Movie</SelectItem>
                <SelectItem value="OVA">OVA</SelectItem>
                <SelectItem value="Special">Special</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Order By Filter */}
        <div>
          <label className="text-white text-xs font-medium mb-1 block">Sort By</label>
          <Select value={order} onValueChange={setOrder}>
            <SelectTrigger className="bg-[#222] border-gray-700 text-white h-8 text-xs">
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent className="bg-[#222] border-gray-700 text-white">
              <SelectItem value="Default">Default</SelectItem>
              <SelectItem value="Latest">Latest</SelectItem>
              <SelectItem value="Oldest">Oldest</SelectItem>
              <SelectItem value="Title (A-Z)">Title (A-Z)</SelectItem>
              <SelectItem value="Title (Z-A)">Title (Z-A)</SelectItem>
              <SelectItem value="Rating (High-Low)">Rating (High-Low)</SelectItem>
              <SelectItem value="Rating (Low-High)">Rating (Low-High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AnimeFilterSidebar;