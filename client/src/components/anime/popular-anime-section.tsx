import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Anime } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const PopularAnimeSection = () => {
  const { data: animesResponse, isLoading, error } = useQuery<PaginatedResponse<Anime>>({
    queryKey: ["/api/animes"],
  });
  
  // Sort animes by rating in descending order and take the top 5
  const popularAnimes = animesResponse?.data
    ? [...animesResponse.data].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)).slice(0, 5)
    : [];
  
  if (error) {
    return (
      <div className="w-full bg-[#1a1a1a] rounded-lg overflow-hidden mt-6">
        <div className="bg-[#ff3a3a] p-4">
          <h2 className="text-lg font-bold text-white">Popular Anime</h2>
        </div>
        <div className="p-4 text-red-500">
          Failed to load popular anime.
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-[#1a1a1a] rounded-lg overflow-hidden mt-6">
      <div className="bg-[#ff3a3a] p-4">
        <h2 className="text-lg font-bold text-white">Popular Anime</h2>
      </div>
      
      <div className="p-2">
        {isLoading ? (
          // Loading skeletons
          Array(5).fill(0).map((_, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 hover:bg-[#222] transition-colors">
              <Skeleton className="h-16 w-12 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))
        ) : (
          popularAnimes.map((anime) => (
            <div key={anime.id} className="flex items-center space-x-3 p-2 hover:bg-[#222] transition-colors">
              <Link href={`/anime/${anime.id}`} className="flex items-center space-x-3 w-full">
                <img 
                  src={anime.coverImage || ''}
                  alt={anime.title} 
                  className="h-16 w-12 object-cover rounded"
                />
                <div>
                  <h3 className="text-white font-medium line-clamp-1">{anime.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>{anime.type}</span>
                    <span>•</span>
                    <span>{anime.releaseYear}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PopularAnimeSection;