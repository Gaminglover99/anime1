import { Link } from "wouter";
import { Anime } from "@shared/schema";
import { Star, Play } from "lucide-react";

interface AnimeCardProps {
  anime: Anime;
  showRating?: boolean;
}

const AnimeCard = ({ anime, showRating = true }: AnimeCardProps) => {
  return (
    <div className="relative group">
      <Link href={`/anime/${anime.id}`}>
        <div className="relative h-60 rounded-lg overflow-hidden cursor-pointer">
          <img
            src={anime.coverImage || ''} 
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
          
          {/* Play overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity duration-300">
            <div className="h-12 w-12 rounded-full bg-[#ff3a3a]/90 flex items-center justify-center">
              <Play className="h-6 w-6 text-white" fill="white" />
            </div>
          </div>
          
          {/* Type badge */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-[#ff3a3a] text-white text-xs font-medium rounded">
              {anime.type}
            </span>
          </div>
          
          {/* Rating */}
          {showRating && (
            <div className="absolute top-2 right-2 bg-black/60 px-1.5 py-0.5 rounded flex items-center">
              <Star className="h-3 w-3 text-yellow-400 mr-1" fill="currentColor" />
              <span className="text-white text-xs font-medium">
                {Number(anime.rating || 0).toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        {/* Title and info */}
        <div className="mt-2">
          <h3 className="font-medium text-white hover:text-[#ff3a3a] transition-colors line-clamp-1 cursor-pointer">
            {anime.title}
          </h3>
          <div className="flex items-center text-xs text-gray-400 mt-1 space-x-2">
            <span>{anime.releaseYear}</span>
            <span>•</span>
            <span>{anime.status}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnimeCard;