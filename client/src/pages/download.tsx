import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Download, Info, Check, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Anime, Episode } from "@shared/schema";
import LoadingAnime from "@/components/ui/loading-anime";
import { useAuth } from "@/hooks/use-auth";
import { Season } from "@shared/schema";

type VideoQuality = {
  label: string;
  value: string;
  size: string;
};

const DownloadPage = () => {
  const { episodeId } = useParams<{ episodeId: string }>();
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("1080p");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch episode details
  const { data: episode, isLoading: isLoadingEpisode } = useQuery<Episode>({
    queryKey: [`/api/episodes/${episodeId}`],
    enabled: !!episodeId,
  });

  // Fetch season data to get anime ID
  const { data: season, isLoading: isLoadingSeason } = useQuery<Season>({
    queryKey: [`/api/seasons/${episode?.seasonId}`],
    enabled: !!episode?.seasonId,
  });
  
  // Fetch anime details based on season data
  const { data: anime, isLoading: isLoadingAnime } = useQuery<Anime>({
    queryKey: [`/api/animes/${season?.animeId}`],
    enabled: !!season?.animeId,
  });

  const videoQualities: VideoQuality[] = [
    { label: "1080p Full HD", value: "1080p", size: "850 MB" },
    { label: "720p HD", value: "720p", size: "450 MB" },
    { label: "480p SD", value: "480p", size: "250 MB" },
    { label: "360p Low", value: "360p", size: "150 MB" },
  ];

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: async (quality: string) => {
      if (!user) {
        throw new Error("You must be logged in to download");
      }
      return await apiRequest("POST", `/api/downloads/${episodeId}`, { quality });
    },
    onSuccess: (_, quality) => {
      toast({
        title: "Download started",
        description: `Your download of ${anime?.title} - Episode ${episode?.number} (${quality}) has started.`,
      });
      
      // In a real app, this would trigger the actual file download
      setTimeout(() => {
        setDownloadStarted(false);
      }, 3000);
    },
    onError: (error) => {
      toast({
        title: "Download failed",
        description: "You must be logged in to download episodes",
        variant: "destructive",
      });
      setDownloadStarted(false);
    }
  });

  const handleDownload = (quality: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in or register to download episodes",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    setDownloadStarted(true);
    downloadMutation.mutate(quality);
  };

  const isLoading = isLoadingAnime || isLoadingEpisode || isLoadingSeason;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-[60vh]">
            <LoadingAnime 
              text={isLoadingAnime ? "Loading anime details..." : "Loading episode details..."}
              size="lg"
            />
          </div>
        </div>
      </Layout>
    );
  }

  if (!anime || !episode) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
            <p className="text-gray-400 mb-6">The episode you're looking for might have been removed or is unavailable.</p>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="text-muted-foreground" 
              onClick={() => navigate(`/watch/${season?.animeId}`)}
            >
              <Info className="w-4 h-4 mr-2" />
              Back to anime
            </Button>
          </div>

          <div className="bg-card rounded-lg overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row p-6">
              <img 
                src={anime.coverImage || ''} 
                alt={anime.title} 
                className="w-full md:w-36 h-48 md:h-auto object-cover rounded mb-4 md:mb-0 md:mr-6"
              />
              <div>
                <h1 className="text-2xl font-bold">{anime.title}</h1>
                <div className="flex items-center text-sm text-muted-foreground my-2">
                  <span className="font-medium bg-[#ff3a3a] text-white px-2 py-0.5 rounded mr-2">
                    Episode {episode.number}
                  </span>
                  <span>{episode.duration}</span>
                </div>
                <h2 className="text-lg font-medium mb-2">{episode.title}</h2>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {episode.description}
                </p>
              </div>
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Download Options</h2>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  {videoQualities.map((quality) => (
                    <TabsTrigger 
                      key={quality.value} 
                      value={quality.value}
                      className="data-[state=active]:bg-[#ff3a3a]"
                    >
                      {quality.value}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {videoQualities.map((quality) => (
                  <TabsContent key={quality.value} value={quality.value}>
                    <div className="bg-background rounded-lg p-4 border mb-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <h3 className="font-bold text-lg">{quality.label}</h3>
                          <div className="text-muted-foreground flex items-center space-x-4 mt-1">
                            <span>File Size: {quality.size}</span>
                            <span>•</span>
                            <span>MP4 Format</span>
                          </div>
                        </div>
                        <Button 
                          className="bg-[#ff3a3a] hover:bg-[#ff3a3a]/90"
                          onClick={() => handleDownload(quality.value)}
                          disabled={downloadStarted}
                        >
                          {downloadStarted ? (
                            <>
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-card rounded-lg p-4 border">
                        <h3 className="font-bold mb-2">Download Information</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            <span>High-quality {quality.value} resolution</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            <span>Fast download servers</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            <span>Compatible with all devices</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            <span>Multiple language subtitles included</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-card rounded-lg p-4 border">
                        <h3 className="font-bold mb-2">Requirements</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                            <span>Stable internet connection recommended</span>
                          </li>
                          <li className="flex items-start">
                            <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                            <span>Compatible video player (VLC recommended)</span>
                          </li>
                          <li className="flex items-start">
                            <X className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                            <span>No special codecs required</span>
                          </li>
                          <li className="flex items-start">
                            <X className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                            <span>No registration required</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Having trouble with your download? <a href="#" className="text-[#ff3a3a] hover:underline">Contact support</a>
            </p>
            <p className="text-xs text-muted-foreground">
              By downloading, you agree to our <a href="#" className="text-[#ff3a3a] hover:underline">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DownloadPage;