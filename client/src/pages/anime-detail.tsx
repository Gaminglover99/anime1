import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/layout";
import AnimeRating from "@/components/ui/anime-rating";
import AnimeCard from "@/components/anime/anime-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Heart, ListPlus, Download, Clock } from "lucide-react";
import { Anime, Season, Episode } from "@shared/schema";
import LoadingAnime from "@/components/ui/loading-anime";

const AnimeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSeasonId, setActiveSeasonId] = useState<number | null>(null);

  // Fetch anime details
  const { data: anime, isLoading: isLoadingAnime, error: animeError } = useQuery<Anime>({
    queryKey: [`/api/animes/${id}`],
  });

  // Fetch seasons for this anime
  const { data: seasons, isLoading: isLoadingSeasons } = useQuery<Season[]>({
    queryKey: [`/api/animes/${id}/seasons`],
    enabled: !!id,
  });

  // Fetch episodes for active season
  const { data: episodes } = useQuery<Episode[]>({
    queryKey: [`/api/seasons/${activeSeasonId}/episodes`],
    enabled: !!activeSeasonId,
  });

  // Fetch related/similar anime (animes with at least one matching genre)
  const { data: relatedAnime } = useQuery<Anime[]>({
    queryKey: [`/api/animes/${id}/related`],
    enabled: !!id,
  });

  // Add to watchlist mutation
  const watchlistMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/watchlist/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Added to Watchlist",
        description: "This anime has been added to your watchlist",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to add to watchlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add to favorites mutation
  const favoritesMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/favorites/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Added to Favorites",
        description: "This anime has been added to your favorites",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to add to favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Set initial active season when data loads
  if (seasons && seasons.length > 0 && !activeSeasonId) {
    setActiveSeasonId(seasons[0].id);
  }

  if (isLoadingAnime) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
          <LoadingAnime text="Loading anime details..." size="lg" />
        </div>
      </Layout>
    );
  }

  if (animeError || !anime) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-gray-200 mb-3">Error Loading Anime</h2>
            <p className="text-gray-400 mb-6">
              We couldn't load the details for this anime. Please try again later.
            </p>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleWatchEpisode = (episodeId: number) => {
    navigate(`/watch/${id}/${activeSeasonId}/${episodeId}`);
  };

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src={anime.bannerImage || anime.coverImage || ''}
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 -mt-24">
          {/* Left Column - Poster and Actions */}
          <div className="flex-shrink-0 w-full lg:w-64">
            <div className="bg-transparent rounded-lg overflow-hidden shadow-xl">
              <img
                src={anime.coverImage || ''}
                alt={anime.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
              <div className="py-4 space-y-4">
                <div className="flex flex-col gap-2">
                  <Link href={`/watch/${id}`}>
                    <Button 
                      className="w-full bg-[#ff3a3a] hover:bg-[#ff3a3a]/80 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" /> Watch Now
                    </Button>
                  </Link>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => watchlistMutation.mutate()}
                    >
                      <ListPlus className="w-4 h-4 mr-2" /> Add to Watchlist
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => favoritesMutation.mutate()}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Anime Details */}
          <div className="flex-grow">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{anime.title}</h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
              <span>{anime.type}</span>
              <span>•</span>
              <span>{anime.duration}</span>
              <span>•</span>
              <span>{anime.status}</span>
              <span>•</span>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span>{Number(anime.rating).toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{anime.releaseYear}</span>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="bg-background/60 border border-border">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="episodes">Episodes</TabsTrigger>
                <TabsTrigger value="related">Related</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Synopsis</h2>
                    <p className="text-gray-300 leading-relaxed">{anime.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h2 className="text-xl font-bold mb-4">Information</h2>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">{anime.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Episodes:</span>
                          <span className="font-medium">{episodes?.length || "Unknown"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium">{anime.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Released:</span>
                          <span className="font-medium">{anime.releaseYear}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">{anime.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-bold mb-4">Genres</h2>
                      <div className="flex flex-wrap gap-2">
                        {/* 
                          The API might not include genres directly on the anime object.
                          We should fetch genres separately through a dedicated endpoint.
                          For now, we use fallback genres as placeholders.
                        */}
                        {anime && (anime as any).genres && Array.isArray((anime as any).genres) ? (
                          (anime as any).genres.map((genre: any) => (
                            <span key={genre.id} className="bg-card px-3 py-1 rounded-md text-sm">
                              {genre.name}
                            </span>
                          ))
                        ) : (
                          <div className="flex gap-2">
                            <span className="bg-card px-3 py-1 rounded-md text-sm">Action</span>
                            <span className="bg-card px-3 py-1 rounded-md text-sm">Adventure</span>
                            <span className="bg-card px-3 py-1 rounded-md text-sm">Fantasy</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="episodes" className="mt-4">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Latest Episodes</h2>
                  {isLoadingSeasons ? (
                    <div className="flex justify-center py-6">
                      <LoadingAnime text="Loading seasons..." size="sm" />
                    </div>
                  ) : seasons && seasons.length > 0 ? (
                    <div className="space-y-6">
                      {/* Season selector */}
                      <div className="flex flex-wrap gap-2">
                        {seasons.map((season) => (
                          <Button
                            key={season.id}
                            variant={activeSeasonId === season.id ? "default" : "outline"}
                            onClick={() => setActiveSeasonId(season.id)}
                            size="sm"
                          >
                            S{season.number}
                          </Button>
                        ))}
                      </div>
                      
                      {/* Episode list */}
                      <div className="grid grid-cols-1 gap-4">
                        {episodes?.map((episode) => (
                          <div
                            key={episode.id}
                            className="bg-card rounded-lg p-3 flex items-center hover:bg-card/80 transition-colors cursor-pointer"
                            onClick={() => handleWatchEpisode(episode.id)}
                          >
                            <img 
                              src={anime.coverImage || ''} 
                              alt={episode.title} 
                              className="w-16 h-16 rounded object-cover mr-4"
                            />
                            <div className="flex-1">
                              <div className="flex items-center">
                                <div className="text-xs font-medium bg-[#ff3a3a] text-white px-2 py-0.5 rounded mr-2">
                                  S{seasons?.find(s => s.id === activeSeasonId)?.number} • EP{episode.number}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {episode.duration}
                                </div>
                              </div>
                              <h3 className="font-medium">{episode.title}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-1">{episode.description}</p>
                            </div>
                            <Play className="w-5 h-5 ml-2 text-muted-foreground" />
                          </div>
                        ))}
                        
                        {episodes?.length === 0 && (
                          <div className="text-center py-6 text-muted-foreground">
                            No episodes available for this season
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No seasons or episodes available
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="related" className="mt-4">
                {relatedAnime && relatedAnime.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {relatedAnime.map((anime) => (
                      <AnimeCard key={anime.id} anime={anime} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No related anime found
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="mt-8 mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Community</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="bg-card/50 rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Join the discussion about {anime.title}</p>
            <Button variant="outline" className="mt-4">Sign in to Comment</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnimeDetailPage;