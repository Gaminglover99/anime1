import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/layout';
import VideoPlayer from '@/components/anime/video-player';
import AnimeCard from '@/components/anime/anime-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Anime, Episode, Season, VideoSource } from '@shared/schema';
import { ChevronLeft, List } from 'lucide-react';
import LoadingAnime from '@/components/ui/loading-anime';

const WatchPage = () => {
  const params = useParams<{ animeId: string; seasonId?: string; episodeId?: string }>();
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('episodes');
  
  const animeId = parseInt(params.animeId);
  const seasonId = params.seasonId ? parseInt(params.seasonId) : undefined;
  const episodeId = params.episodeId ? parseInt(params.episodeId) : undefined;
  
  // Fetch anime details
  const { data: anime, isLoading: isLoadingAnime } = useQuery<Anime>({
    queryKey: [`/api/animes/${animeId}`],
  });
  
  // Fetch seasons for this anime
  const { data: seasons, isLoading: isLoadingSeasons } = useQuery<Season[]>({
    queryKey: [`/api/animes/${animeId}/seasons`],
    enabled: !!animeId,
  });
  
  // Find active season - either from URL param or default to first season
  const [activeSeasonId, setActiveSeasonId] = useState<number | undefined>(seasonId);
  
  // When seasons load and no active season is set, use the first one
  useEffect(() => {
    if (seasons?.length && !activeSeasonId) {
      setActiveSeasonId(seasons[0].id);
    }
  }, [seasons, activeSeasonId]);
  
  // Fetch episodes for active season
  const { data: episodes, isLoading: isLoadingEpisodes } = useQuery<Episode[]>({
    queryKey: [`/api/seasons/${activeSeasonId}/episodes`],
    enabled: !!activeSeasonId,
  });
  
  // Find active episode - either from URL param or default to first episode
  const [activeEpisodeId, setActiveEpisodeId] = useState<number | undefined>(episodeId);
  
  // When episodes load and no active episode is set, use the first one
  useEffect(() => {
    if (episodes?.length && !activeEpisodeId) {
      setActiveEpisodeId(episodes[0].id);
    }
  }, [episodes, activeEpisodeId]);
  
  // Fetch video sources for active episode
  const { data: videoSources, isLoading: isLoadingVideoSources } = useQuery<VideoSource[]>({
    queryKey: [`/api/episodes/${activeEpisodeId}/videoSources`],
    enabled: !!activeEpisodeId,
  });
  
  // Fetch related/similar anime
  const { data: relatedAnime } = useQuery<Anime[]>({
    queryKey: [`/api/animes/${animeId}/related`],
    enabled: !!animeId,
  });
  
  // Track watch progress
  const watchProgressMutation = useMutation({
    mutationFn: async ({ progress, completed }: { progress: number; completed: boolean }) => {
      if (!user || !activeEpisodeId) return;
      
      const res = await apiRequest(
        "POST", 
        `/api/user/watchProgress/${activeEpisodeId}`,
        { progress, completed }
      );
      return res.json();
    },
  });
  
  // Get active episode details
  const activeEpisode = episodes?.find(ep => ep.id === activeEpisodeId);
  
  // Get next and previous episodes
  const getEpisodeIndex = () => {
    if (!episodes || !activeEpisodeId) return -1;
    return episodes.findIndex(ep => ep.id === activeEpisodeId);
  };
  
  const episodeIndex = getEpisodeIndex();
  const hasPrevEpisode = episodeIndex > 0;
  const hasNextEpisode = episodes && episodeIndex >= 0 && episodeIndex < episodes.length - 1;
  
  const handlePrevEpisode = () => {
    if (!episodes || episodeIndex <= 0) return;
    const prevEpisode = episodes[episodeIndex - 1];
    setActiveEpisodeId(prevEpisode.id);
    navigate(`/watch/${animeId}/${activeSeasonId}/${prevEpisode.id}`);
  };
  
  const handleNextEpisode = () => {
    if (!episodes || !hasNextEpisode) return;
    const nextEpisode = episodes[episodeIndex + 1];
    setActiveEpisodeId(nextEpisode.id);
    navigate(`/watch/${animeId}/${activeSeasonId}/${nextEpisode.id}`);
  };
  
  const handleSeasonChange = (newSeasonId: number) => {
    setActiveSeasonId(newSeasonId);
    setActiveEpisodeId(undefined); // Reset active episode when changing season
  };
  
  const handleEpisodeClick = (episode: Episode) => {
    setActiveEpisodeId(episode.id);
    navigate(`/watch/${animeId}/${activeSeasonId}/${episode.id}`);
  };
  
  const handleVideoComplete = () => {
    watchProgressMutation.mutate({ progress: 1, completed: true });
    
    // Auto-play next episode if available
    if (hasNextEpisode) {
      toast({
        title: "Episode completed",
        description: "Playing next episode...",
      });
      handleNextEpisode();
    } else {
      toast({
        title: "Episode completed",
        description: "You've finished all available episodes for this season.",
      });
    }
  };
  
  const updateWatchProgress = (progress: number) => {
    if (user && activeEpisodeId && progress > 0) {
      watchProgressMutation.mutate({ progress, completed: false });
    }
  };
  
  // Loading state
  if (isLoadingAnime || isLoadingSeasons || (isLoadingEpisodes && !episodes)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
          <LoadingAnime 
            text={
              isLoadingAnime 
                ? "Loading anime..." 
                : isLoadingSeasons 
                  ? "Loading seasons..." 
                  : "Loading episodes..."
            } 
            size="lg" 
          />
        </div>
      </Layout>
    );
  }
  
  if (!anime) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Anime not found</h2>
          <p className="text-muted-foreground mb-6">The anime you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="bg-black text-white min-h-screen">
        {/* Two-column layout for video player and episode list */}
        <div className="flex flex-col lg:flex-row">
          {/* Main content - video player */}
          <div className="w-full lg:w-2/3 lg:min-h-screen">
            {/* Video player */}
            <div className="relative">
              {isLoadingVideoSources ? (
                <div className="w-full aspect-video flex items-center justify-center bg-black">
                  <LoadingAnime text="Loading video..." size="md" />
                </div>
              ) : videoSources && activeEpisode ? (
                <VideoPlayer
                  sources={videoSources}
                  title={activeEpisode.title || ''}
                  episodeNumber={activeEpisode.number}
                  onNextEpisode={hasNextEpisode ? handleNextEpisode : undefined}
                  onPrevEpisode={hasPrevEpisode ? handlePrevEpisode : undefined}
                  hasNextEpisode={hasNextEpisode}
                  hasPrevEpisode={hasPrevEpisode}
                  onComplete={handleVideoComplete}
                />
              ) : (
                <div className="w-full aspect-video flex items-center justify-center bg-black">
                  <div className="text-center">
                    <h3 className="text-xl font-medium mb-2">No video available</h3>
                    <p className="text-gray-400">This episode doesn't have any video sources.</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Episode info and navigation */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex flex-wrap items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-gray-400">
                    <span>{anime.title}</span>
                    <span className="mx-2">•</span>
                    <span>Season {seasons?.data?.find(s => s.id === activeSeasonId)?.number || 1}</span>
                    <span className="mx-2">•</span>
                    <span>Episode {activeEpisode?.number || 1}</span>
                  </div>
                  <h1 className="text-xl font-bold mt-1">
                    {activeEpisode?.title || `Episode ${activeEpisode?.number || 1}`}
                  </h1>
                </div>
                
                <div className="flex gap-2 mt-2 lg:mt-0">
                  <Button
                    variant="outline"
                    className="bg-[#222] border-gray-700 hover:bg-gray-700"
                    onClick={() => navigate(`/anime/${animeId}`)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  
                  <Button 
                    onClick={() => handleNextEpisode()} 
                    disabled={!hasNextEpisode}
                    className="bg-[#ff3a3a] hover:bg-red-700 text-white"
                  >
                    Next
                  </Button>
                </div>
              </div>
              
              {activeEpisode?.description && (
                <p className="mt-3 text-gray-400 text-sm">{activeEpisode.description}</p>
              )}
            </div>
          </div>
          
          {/* Sidebar - episode list */}
          <div className="w-full lg:w-1/3 bg-[#111] border-l border-gray-800 lg:max-h-screen lg:overflow-y-auto">
            {/* Season dropdown */}
            <div className="p-4 border-b border-gray-800">
              <select 
                className="w-full bg-[#222] text-white border border-gray-700 rounded p-2"
                value={activeSeasonId}
                onChange={(e) => handleSeasonChange(parseInt(e.target.value))}
              >
                {seasons?.map(season => (
                  <option key={season.id} value={season.id}>
                    Season {season.number}: Season {season.number}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Episode list */}
            <div className="p-4">
              <div className="space-y-3">
                {episodes?.map(episode => (
                  <div
                    key={episode.id}
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      episode.id === activeEpisodeId 
                        ? "bg-[#222]" 
                        : "hover:bg-[#1a1a1a]"
                    }`}
                    onClick={() => handleEpisodeClick(episode)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded flex items-center justify-center ${
                        episode.id === activeEpisodeId 
                          ? "bg-[#ff3a3a] text-white" 
                          : "bg-[#333] text-gray-300"
                      }`}>
                        {episode.number}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{episode.title || `Episode ${episode.number}`}</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {episode.id === activeEpisodeId 
                            ? <span className="text-[#ff3a3a]">Now Playing</span> 
                            : <span>{episode.duration || "24 min"}</span>
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!episodes || episodes.length === 0) && (
                  <div className="text-center py-6 text-gray-400">
                    No episodes available for this season
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WatchPage;