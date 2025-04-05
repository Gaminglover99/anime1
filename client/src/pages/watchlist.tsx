import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/layout";
import AnimeCard from "@/components/anime/anime-card";
import { Anime } from "@shared/schema";
import LoadingAnime from "@/components/ui/loading-anime";
import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";

const WatchlistPage = () => {
  const [location, navigate] = useLocation();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to auth page if user is not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/auth");
    }
  }, [user, isAuthLoading, navigate]);

  // Fetch user's watchlist
  const { data: watchlist, isLoading, error } = useQuery<Anime[]>({
    queryKey: ["/api/watchlist"],
    enabled: !!user,
  });

  // Remove from watchlist mutation
  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (animeId: number) => {
      return await apiRequest("DELETE", `/api/watchlist/${animeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Removed from watchlist",
        description: "Anime has been removed from your watchlist",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to remove from watchlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRemoveFromWatchlist = (animeId: number) => {
    removeFromWatchlistMutation.mutate(animeId);
  };

  if (isAuthLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <LoadingAnime text="Loading watchlist..." />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Will redirect to auth page via useEffect
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load watchlist. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingAnime text="Loading your watchlist..." />
          </div>
        ) : watchlist && watchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {watchlist.map((anime) => (
              <div key={anime.id} className="relative group">
                <AnimeCard anime={anime} />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleRemoveFromWatchlist(anime.id)}
                  >
                    <span className="sr-only">Remove from watchlist</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 mb-6 text-gray-400">
              <UserRoundPlus size={96} className="opacity-50" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-8">
              Add anime to your watchlist to keep track of shows you want to watch later
            </p>
            <Button onClick={() => navigate("/")}>Browse Anime</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WatchlistPage;