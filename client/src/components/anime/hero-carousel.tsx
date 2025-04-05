import { useState, useEffect } from 'react';
import { Anime } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link, useLocation } from 'wouter';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroCarousel = () => {
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

  const { data: animesResponse, isLoading, error } = useQuery<PaginatedResponse<Anime>>({
    queryKey: ['/api/animes'],
  });

  // Select featured animes and limit to a maximum of 5
  const featuredAnimes = animesResponse?.data
    ? animesResponse.data.filter(anime => anime.featured).slice(0, 5)
    : [];

  if (error) {
    return (
      <div className="w-full h-[450px] bg-card rounded-lg flex items-center justify-center">
        <p className="text-destructive">Failed to load featured anime</p>
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton className="w-full h-[450px] rounded-lg" />;
  }

  if (featuredAnimes.length === 0) {
    return (
      <div className="w-full h-[450px] bg-card rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No featured anime available</p>
      </div>
    );
  }

  return (
    <Swiper
      spaceBetween={0}
      centeredSlides={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
        el: '.swiper-pagination',
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      loop={true} // Enable looping from last slide to first
      className="w-full h-[450px] rounded-lg overflow-hidden"
    >
      {featuredAnimes.map((anime) => (
        <SwiperSlide key={anime.id}>
          <div className="relative w-full h-full">
            <img
              src={anime.bannerImage || anime.coverImage || ''}
              alt={anime.title}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 max-w-2xl">
              <div className="mb-2">
                <span className="bg-[#ff3a3a] text-white text-sm font-medium px-2 py-1 rounded mr-2">
                  {anime.type}
                </span>
                <span className="bg-black/60 text-white text-sm font-medium px-2 py-1 rounded">
                  {anime.status}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{anime.title}</h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
                <span>{anime.releaseYear}</span>
                <span>•</span>
                <span>{anime.duration}</span>
                <span>•</span>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span>{Number(anime.rating).toFixed(1)}</span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 line-clamp-3">{anime.description}</p>
              
              <div className="flex space-x-4">
                <Link href={`/watch/${anime.id}`}>
                  <Button 
                    className="bg-[#ff3a3a] hover:bg-[#ff3a3a]/90 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Now
                  </Button>
                </Link>
                <Link href={`/anime/${anime.id}`}>
                  <Button 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    More Info
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
      
      {/* Custom pagination dots - positioned at the bottom center */}
      <div className="swiper-pagination !bottom-6 !z-10 flex justify-center"></div>
    </Swiper>
  );
};

export default HeroCarousel;