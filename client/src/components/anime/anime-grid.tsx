import { Anime } from "@shared/schema";
import AnimeCard from "./anime-card";

interface AnimeGridProps {
  animes: Anime[];
  columns?: number;
  showRating?: boolean;
  className?: string;
}

const AnimeGrid = ({
  animes,
  columns = 5,
  showRating = true,
  className = "",
}: AnimeGridProps) => {
  // Determine number of columns based on props
  let gridCols: string;
  switch (columns) {
    case 3:
      gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      break;
    case 4:
      gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      break;
    case 6:
      gridCols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";
      break;
    case 5:
    default:
      gridCols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
  }

  return (
    <div className={`grid ${gridCols} gap-4 md:gap-5 lg:gap-6 ${className}`}>
      {animes.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} showRating={showRating} />
      ))}
    </div>
  );
};

export default AnimeGrid;