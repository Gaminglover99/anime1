import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, Search, X } from "lucide-react";
import { Anime } from '@shared/schema';
import { eventBus } from '@/lib/event-bus';
import LoadingAnime from "../ui/loading-anime";

interface SearchAutocompleteProps {
  initialQuery?: string;
  onClose?: () => void;
  inline?: boolean;
}

const SearchAutocomplete = ({ initialQuery = '', onClose, inline = false }: SearchAutocompleteProps) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isListening, setIsListening] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  // Fetch anime data for autocomplete
  const { data: animeResults, isLoading } = useQuery<{ data: Anime[] }>({
    queryKey: ['/api/animes/search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return { data: [] };
      const res = await fetch(`/api/animes/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
      if (!res.ok) throw new Error('Failed to fetch search results');
      return res.json();
    },
    enabled: searchQuery.length >= 2,
  });

  // Handle voice search
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(true);
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setShowResults(false);
    }
  };

  // Navigate to anime detail when clicked
  const goToAnimeDetail = (animeId: number) => {
    window.location.href = `/anime/${animeId}`;
    if (onClose) onClose();
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Show results when typing
  useEffect(() => {
    if (searchQuery.length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchQuery]);

  const exactMatches = animeResults?.data?.filter(
    anime => anime.title.toLowerCase() === searchQuery.toLowerCase()
  ) || [];
  
  const sortedResults = animeResults?.data ? [
    ...exactMatches,
    ...animeResults.data.filter(anime => !exactMatches.some(exact => exact.id === anime.id))
  ] : [];

  return (
    <div ref={searchRef} className={`relative ${inline ? 'w-full' : ''}`}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search anime..."
          className={`${inline ? 'w-full' : 'w-64 md:w-80'} bg-gray-800 border-gray-700 text-white pr-16`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
          <button
            type="button"
            onClick={startVoiceSearch}
            className={`p-1 mr-1 rounded-full ${isListening ? 'text-[#ff3a3a]' : 'text-gray-400 hover:text-white'}`}
          >
            <Mic className="h-4 w-4" />
          </button>
          
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 mr-1 rounded-full text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <Button type="submit" size="icon" variant="ghost" className="h-8 w-8">
            <Search className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </form>

      {/* Autocomplete results dropdown */}
      {showResults && searchQuery.length >= 2 && (
        <div className="absolute z-50 mt-1 max-w-[350px] w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-4 flex justify-center items-center">
              <LoadingAnime size="sm" text="Searching..." />
            </div>
          ) : sortedResults.length > 0 ? (
            <div className="max-h-72 overflow-y-auto">
              {sortedResults.map((anime) => {
                const isExactMatch = anime.title.toLowerCase() === searchQuery.toLowerCase();
                
                return (
                  <div
                    key={anime.id}
                    className={`flex items-start p-2 hover:bg-gray-700 cursor-pointer ${isExactMatch ? 'bg-gray-700/50' : ''}`}
                    onClick={() => goToAnimeDetail(anime.id)}
                  >
                    <img
                      src={anime.coverImage || anime.bannerImage || ''}
                      alt={anime.title}
                      className="w-10 h-14 object-cover rounded mr-2 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x140?text=No+Image';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-sm truncate ${isExactMatch ? 'text-[#ff3a3a]' : 'text-white'}`}>
                        {anime.title}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        {anime.type} • {anime.releaseYear}
                        {anime.status && ` • ${anime.status}`}
                      </p>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                        {anime.description || 'No description available.'}
                      </p>
                    </div>
                    {isExactMatch && (
                      <span className="ml-2 rounded-full bg-[#ff3a3a]/10 px-2 py-0.5 text-[10px] font-semibold text-[#ff3a3a]">
                        Exact
                      </span>
                    )}
                  </div>
                );
              })}
              <div className="p-2 border-t border-gray-700">
                <Button 
                  variant="ghost" 
                  className="w-full text-sm text-[#ff3a3a] hover:text-white hover:bg-gray-700"
                  onClick={() => window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`}
                >
                  See all results for "{searchQuery}"
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              {searchQuery.length >= 2 ? 'No results found' : 'Type at least 2 characters to search'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;