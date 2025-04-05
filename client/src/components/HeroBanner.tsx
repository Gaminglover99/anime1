import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface Genre {
  id: number;
  name: string;
}

interface FeaturedAnime {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  genres: Genre[];
}

const HeroBanner = () => {
  const { data: featured, isLoading } = useQuery<FeaturedAnime>({
    queryKey: ['/api/featured'],
  });

  if (isLoading || !featured) {
    return (
      <section className="relative h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[#1E1E1E] animate-pulse"></div>
      </section>
    );
  }

  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={featured.imageUrl} 
          alt={featured.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/70 via-[#121212]/50 to-[#121212]/70"></div>
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-end pb-16">
        <div className="max-w-2xl">
          <span className="bg-[#FF3860] text-white py-1 px-3 rounded-full text-sm font-medium">FEATURED</span>
          <h1 className="text-4xl md:text-6xl font-bold font-poppins mt-4 leading-tight">{featured.title}</h1>
          <p className="text-lg text-[#BBBBBB] mt-4 mb-6 line-clamp-3">{featured.description}</p>
          
          <div className="flex flex-wrap gap-4 mb-8">
            {featured.genres.map(genre => (
              <div key={genre.id} className="px-3 py-1 bg-[#2D2D2D] rounded-full text-sm font-medium">
                {genre.name}
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link href={`/anime/${featured.id}`}>
              <button className="bg-[#6C5CE7] hover:bg-[#6C5CE7]/90 text-white px-6 py-3 rounded-md font-medium flex items-center gap-2">
                <i className="fas fa-play"></i> Watch Now
              </button>
            </Link>
            <button className="bg-[#2D2D2D] hover:bg-[#2D2D2D]/80 text-white px-6 py-3 rounded-md font-medium flex items-center gap-2">
              <i className="fas fa-plus"></i> Add to List
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
