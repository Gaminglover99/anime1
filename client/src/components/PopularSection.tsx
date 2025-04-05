import { useQuery } from "@tanstack/react-query";
import AnimeCard from "./AnimeCard";
import { Link } from "wouter";

interface Anime {
  id: number;
  title: string;
  imageUrl: string;
  rating: string;
  isNew: boolean;
  type: string;
  subbed: boolean;
  dubbed: boolean;
}

const PopularSection = () => {
  const { data: popularAnimes, isLoading } = useQuery<Anime[]>({
    queryKey: ['/api/popular'],
  });

  return (
    <section className="py-10 container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-poppins">Popular This Week</h2>
        <Link href="/popular">
          <a className="text-[#6C5CE7] hover:text-[#6C5CE7]/80 font-medium flex items-center">
            View All <i className="fas fa-chevron-right ml-2 text-xs"></i>
          </a>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[3/4] bg-[#2D2D2D] rounded-lg"></div>
              <div className="h-4 bg-[#2D2D2D] rounded mt-2 w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {popularAnimes?.map(anime => (
            <AnimeCard 
              key={anime.id}
              id={anime.id}
              title={anime.title}
              imageUrl={anime.imageUrl}
              rating={anime.rating}
              isNew={anime.isNew}
              type="TV Series"
              subbed={anime.subbed}
              dubbed={anime.dubbed}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularSection;
