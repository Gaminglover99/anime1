import { Link } from "wouter";

interface AnimeCardProps {
  id: number;
  title: string;
  imageUrl: string;
  rating?: string;
  isNew?: boolean;
  type?: string;
  format?: "TV Series" | "Movie" | "OVA" | "Special";
  subbed?: boolean;
  dubbed?: boolean;
}

const AnimeCard = ({ 
  id, 
  title, 
  imageUrl, 
  rating, 
  isNew = false, 
  type = "TV Series", 
  subbed = true, 
  dubbed = false 
}: AnimeCardProps) => {
  return (
    <Link href={`/anime/${id}`}>
      <div className="anime-card relative group rounded-lg overflow-hidden cursor-pointer">
        <div className="aspect-[3/4] bg-[#2D2D2D]">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="anime-card-overlay absolute inset-0 bg-[#121212]/80 flex flex-col justify-end p-3">
          {isNew && (
            <div className="bg-[#FF3860]/80 text-white text-xs font-bold py-1 px-2 rounded mb-2 self-start">NEW</div>
          )}
          {rating && (
            <div className="flex items-center mb-1">
              <i className="fas fa-star text-yellow-500 mr-1 text-xs"></i>
              <span className="text-sm">{rating}</span>
            </div>
          )}
          <h3 className="font-medium text-sm mb-1">{title}</h3>
          <div className="flex items-center text-xs text-[#BBBBBB]">
            <span>{type}</span>
            <span className="mx-1">•</span>
            <span>
              {subbed && dubbed 
                ? "Sub | Dub" 
                : subbed 
                  ? "Sub" 
                  : dubbed 
                    ? "Dub" 
                    : ""}
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none">
          <h3 className="font-medium text-sm group-hover:opacity-0 transition-opacity">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
