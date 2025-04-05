import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface Genre {
  id: number;
  name: string;
  imageUrl: string;
}

const GenreSection = () => {
  const { data: genres, isLoading } = useQuery<Genre[]>({
    queryKey: ['/api/genres'],
  });

  return (
    <section className="py-8 container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-poppins">Browse by Genre</h2>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[16/9] bg-[#2D2D2D] rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {genres?.map(genre => (
            <Link key={genre.id} href={`/genre/${genre.id}`}>
              <div className="relative rounded-lg overflow-hidden aspect-[16/9] group cursor-pointer">
                <img 
                  src={genre.imageUrl} 
                  alt={`${genre.name} genre`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#121212]/50 group-hover:bg-[#121212]/70 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold font-poppins">{genre.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default GenreSection;
