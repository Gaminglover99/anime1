import { Star, StarHalf } from "lucide-react";

interface AnimeRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const AnimeRating = ({ rating, size = "md", className = "" }: AnimeRatingProps) => {
  // Convert rating to a 0-5 scale if it's on a 0-10 scale
  const normalizedRating = rating > 5 ? rating / 2 : rating;
  
  // Calculate full and half stars
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating - fullStars >= 0.5;
  
  // Size classes
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  
  const starSize = sizeClasses[size];
  
  return (
    <div className={`flex items-center ${className}`}>
      {/* Render filled stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star 
          key={`full-${i}`} 
          className={`${starSize} text-yellow-400 mr-0.5`} 
          fill="currentColor" 
        />
      ))}
      
      {/* Render half star if needed */}
      {hasHalfStar && (
        <StarHalf 
          className={`${starSize} text-yellow-400 mr-0.5`} 
          fill="currentColor" 
        />
      )}
      
      {/* Render empty stars */}
      {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
        <Star 
          key={`empty-${i}`} 
          className={`${starSize} text-gray-400 mr-0.5`} 
        />
      ))}
      
      {/* Display numeric rating */}
      <span className="ml-1 text-white font-medium">
        {normalizedRating.toFixed(1)}
      </span>
    </div>
  );
};

export default AnimeRating;