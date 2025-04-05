import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import AnimeCard from "@/components/anime/anime-card";
import AnimeGrid from "@/components/anime/anime-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Anime } from "@shared/schema";
import AnimeFilterSidebar, { AnimeFilters } from "@/components/filters/anime-filter-sidebar";
import PopularAnimeSection from "@/components/anime/popular-anime-section";
import HeroCarousel from "@/components/anime/hero-carousel";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("weekly");
  const [filters, setFilters] = useState<AnimeFilters>({ page: 1, limit: 10 });
  const [location, setLocation] = useLocation();

  // Fetch all animes for featured sections
  const { data: allAnimesResponse, isLoading: isLoadingAll } = useQuery<PaginatedResponse<Anime>>({
    queryKey: ["/api/animes"],
  });

  // Filter animes for different sections using all animes
  const animes = allAnimesResponse?.data || [];
  const featuredAnimes = animes.filter((anime) => anime.featured);
  const newReleases = animes.filter(
    (anime) => anime.status === "Ongoing" || anime.releaseYear >= new Date().getFullYear() - 1
  ).sort((a, b) => b.releaseYear - a.releaseYear);
  
  const popularAnimes = [...animes].sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, 10);
  
  // Filter for different time periods for the Popular Series section
  const weeklyPopular = popularAnimes.slice(0, 6);
  const monthlyPopular = [...popularAnimes].sort(() => Math.random() - 0.5).slice(0, 6); // Shuffled for demo
  const allTimePopular = [...popularAnimes].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 6);

  // Category sections with real genre filtering
  const getAnimesByGenre = (genreName: string) => {
    return animes.filter(anime => {
      // Check if the anime has the specified genre
      const animeWithGenres = anime as any; // Temporary cast to avoid TS error
      return animeWithGenres.genres?.some((genre: any) => genre.name === genreName);
    }).slice(0, 10);
  };
  
  const actionAnimes = getAnimesByGenre("Action");
  const adventureAnimes = getAnimesByGenre("Adventure");
  const comedyAnimes = getAnimesByGenre("Comedy");
  const fantasyAnimes = getAnimesByGenre("Fantasy");
  const romanceAnimes = getAnimesByGenre("Romance");
  const dramaAnimes = getAnimesByGenre("Drama");

  // Handle filter changes - now only redirects to the search page
  const handleFilterChange = (newFilters: AnimeFilters) => {
    // Check if there are actual filters being applied
    const hasActiveFilters = 
      !!newFilters.search || 
      !!newFilters.genreId || 
      !!newFilters.year || 
      !!newFilters.status || 
      !!newFilters.type || 
      !!newFilters.order;
    
    if (hasActiveFilters) {
      // Redirect to the search page with the filters
      const searchParams = new URLSearchParams();
      
      if (newFilters.search) {
        searchParams.set('q', newFilters.search);
      }
      if (newFilters.genreId) {
        searchParams.set('genreId', newFilters.genreId.toString());
      }
      if (newFilters.year) {
        searchParams.set('year', newFilters.year);
      }
      if (newFilters.status) {
        searchParams.set('status', newFilters.status);
      }
      if (newFilters.type) {
        searchParams.set('type', newFilters.type);
      }
      if (newFilters.order) {
        searchParams.set('order', newFilters.order);
      }
      
      // Navigate to search page with query params
      setLocation(`/search?${searchParams.toString()}`);
    }
  };

  if (isLoadingAll) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative mb-8">
        <HeroCarousel />
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Main content area with sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content - 75% width on large screens */}
          <div className="w-full lg:w-3/4">
            {/* Search section completely removed from homepage */}
            
            {/* Homepage content */}
            {/* New Releases */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">New Releases</h2>
                <a href="/anime/new" className="text-[#ff3a3a] hover:underline">
                  View All
                </a>
              </div>

              <div className="relative">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={1}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={{ 
                    clickable: true,
                    el: '.swiper-pagination-new-releases'
                  }}
                  navigation={true}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                  }}
                  className="new-releases-swiper px-1"
                >
                  {newReleases.map((anime) => (
                    <SwiperSlide key={anime.id}>
                      <AnimeCard anime={anime} />
                    </SwiperSlide>
                  ))}
                  <div className="swiper-pagination-new-releases mt-4 flex justify-center"></div>
                </Swiper>
              </div>
            </section>

            {/* Popular Anime */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Popular Anime</h2>
                <a href="/anime/popular" className="text-[#ff3a3a] hover:underline">
                  View All
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
                {popularAnimes.slice(0, 8).map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            </section>

            {/* Popular Series Tabs */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Popular Series</h2>
              </div>

              <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 bg-gray-800">
                  <TabsTrigger value="weekly" className="data-[state=active]:bg-[#ff3a3a]">
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="data-[state=active]:bg-[#ff3a3a]">
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger value="all-time" className="data-[state=active]:bg-[#ff3a3a]">
                    All Time
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="weekly">
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{
                      delay: 3500,
                      disableOnInteraction: false,
                    }}
                    navigation={true}
                    pagination={{ 
                      clickable: true,
                      el: '.swiper-pagination-weekly'
                    }}
                    breakpoints={{
                      640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      1024: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                      },
                    }}
                    className="popular-swiper"
                  >
                    {weeklyPopular.map((anime) => (
                      <SwiperSlide key={anime.id}>
                        <AnimeCard anime={anime} />
                      </SwiperSlide>
                    ))}
                    <div className="swiper-pagination-weekly mt-4 flex justify-center"></div>
                  </Swiper>
                </TabsContent>

                <TabsContent value="monthly">
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{
                      delay: 4500,
                      disableOnInteraction: false,
                    }}
                    navigation={true}
                    pagination={{ 
                      clickable: true,
                      el: '.swiper-pagination-monthly'
                    }}
                    breakpoints={{
                      640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      1024: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                      },
                    }}
                    className="popular-swiper"
                  >
                    {monthlyPopular.map((anime) => (
                      <SwiperSlide key={anime.id}>
                        <AnimeCard anime={anime} />
                      </SwiperSlide>
                    ))}
                    <div className="swiper-pagination-monthly mt-4 flex justify-center"></div>
                  </Swiper>
                </TabsContent>

                <TabsContent value="all-time">
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{
                      delay: 5500,
                      disableOnInteraction: false,
                    }}
                    navigation={true}
                    pagination={{ 
                      clickable: true,
                      el: '.swiper-pagination-alltime'
                    }}
                    breakpoints={{
                      640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      1024: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                      },
                    }}
                    className="popular-swiper"
                  >
                    {allTimePopular.map((anime) => (
                      <SwiperSlide key={anime.id}>
                        <AnimeCard anime={anime} />
                      </SwiperSlide>
                    ))}
                    <div className="swiper-pagination-alltime mt-4 flex justify-center"></div>
                  </Swiper>
                </TabsContent>
              </Tabs>
            </section>

            {/* Categories */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Categories</h2>

              <div className="grid grid-cols-1 gap-8">
                {/* Action */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Action</h3>
                    <a href="/genre/action" className="text-[#ff3a3a] hover:underline">
                      View All
                    </a>
                  </div>
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                    }}
                    navigation={true}
                    pagination={{ 
                      clickable: true,
                      el: '.swiper-pagination-action'
                    }}
                    breakpoints={{
                      640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      1024: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                      },
                    }}
                    className="category-swiper"
                  >
                    {actionAnimes.map((anime) => (
                      <SwiperSlide key={anime.id}>
                        <AnimeCard anime={anime} />
                      </SwiperSlide>
                    ))}
                    <div className="swiper-pagination-action mt-4 flex justify-center"></div>
                  </Swiper>
                </div>

                {/* Adventure */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Adventure</h3>
                    <a href="/genre/adventure" className="text-[#ff3a3a] hover:underline">
                      View All
                    </a>
                  </div>
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                    }}
                    navigation={true}
                    pagination={{ 
                      clickable: true,
                      el: '.swiper-pagination-adventure'
                    }}
                    breakpoints={{
                      640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      1024: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                      },
                    }}
                    className="category-swiper"
                  >
                    {adventureAnimes.map((anime) => (
                      <SwiperSlide key={anime.id}>
                        <AnimeCard anime={anime} />
                      </SwiperSlide>
                    ))}
                    <div className="swiper-pagination-adventure mt-4 flex justify-center"></div>
                  </Swiper>
                </div>

                {/* Comedy */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Comedy</h3>
                    <a href="/genre/comedy" className="text-[#ff3a3a] hover:underline">
                      View All
                    </a>
                  </div>
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{
                      delay: 6000,
                      disableOnInteraction: false,
                    }}
                    navigation={true}
                    pagination={{ 
                      clickable: true,
                      el: '.swiper-pagination-comedy'
                    }}
                    breakpoints={{
                      640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      1024: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                      },
                    }}
                    className="category-swiper"
                  >
                    {comedyAnimes.map((anime) => (
                      <SwiperSlide key={anime.id}>
                        <AnimeCard anime={anime} />
                      </SwiperSlide>
                    ))}
                    <div className="swiper-pagination-comedy mt-4 flex justify-center"></div>
                  </Swiper>
                </div>

                {/* Fantasy */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Fantasy</h3>
                    <a href="/genre/fantasy" className="text-[#ff3a3a] hover:underline">
                      View All
                    </a>
                  </div>
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{
                      delay: 4500,
                      disableOnInteraction: false,
                    }}
                    navigation={true}
                    pagination={{ 
                      clickable: true,
                      el: '.swiper-pagination-fantasy'
                    }}
                    breakpoints={{
                      640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      1024: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                      },
                    }}
                    className="category-swiper"
                  >
                    {fantasyAnimes.map((anime) => (
                      <SwiperSlide key={anime.id}>
                        <AnimeCard anime={anime} />
                      </SwiperSlide>
                    ))}
                    <div className="swiper-pagination-fantasy mt-4 flex justify-center"></div>
                  </Swiper>
                </div>

                {/* Romance */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Romance</h3>
                    <a href="/genre/romance" className="text-[#ff3a3a] hover:underline">
                      View All
                    </a>
                  </div>
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{
                      delay: 5500,
                      disableOnInteraction: false,
                    }}
                    navigation={true}
                    pagination={{ 
                      clickable: true,
                      el: '.swiper-pagination-romance'
                    }}
                    breakpoints={{
                      640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      1024: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                      },
                    }}
                    className="category-swiper"
                  >
                    {romanceAnimes.map((anime) => (
                      <SwiperSlide key={anime.id}>
                        <AnimeCard anime={anime} />
                      </SwiperSlide>
                    ))}
                    <div className="swiper-pagination-romance mt-4 flex justify-center"></div>
                  </Swiper>
                </div>

                {/* Drama */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Drama</h3>
                    <a href="/genre/drama" className="text-[#ff3a3a] hover:underline">
                      View All
                    </a>
                  </div>
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{
                      delay: 6500,
                      disableOnInteraction: false,
                    }}
                    navigation={true}
                    pagination={{ 
                      clickable: true,
                      el: '.swiper-pagination-drama'
                    }}
                    breakpoints={{
                      640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      1024: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                      },
                    }}
                    className="category-swiper"
                  >
                    {dramaAnimes.map((anime) => (
                      <SwiperSlide key={anime.id}>
                        <AnimeCard anime={anime} />
                      </SwiperSlide>
                    ))}
                    <div className="swiper-pagination-drama mt-4 flex justify-center"></div>
                  </Swiper>
                </div>
              </div>
            </section>
          </div>
          
          {/* Sidebar - 25% width on large screens */}
          <div className="w-full lg:w-1/4 space-y-6">
            {/* Filter Section */}
            <AnimeFilterSidebar onFilterChange={handleFilterChange} />
            
            {/* Popular Anime Section */}
            <PopularAnimeSection />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
