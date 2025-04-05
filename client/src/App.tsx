import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import AuthPage from "@/pages/auth-page";
import AnimeDetail from "@/pages/anime-detail";
import WatchPage from "@/pages/watch";
import SearchPage from "@/pages/search";
import WatchlistPage from "@/pages/watchlist";
import FavoritesPage from "@/pages/favorites";
import DownloadPage from "@/pages/download";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminAnimeList from "@/pages/admin/anime-list";
import AdminAnimeEdit from "@/pages/admin/anime-edit";
import AdminSeasonManagement from "@/pages/admin/season-management";
import AdminEpisodeManagement from "@/pages/admin/episode-management";
import AdminUserManagement from "@/pages/admin/user-management";
import AdminUserSessions from "@/pages/admin/user-sessions";
import AdminAnalytics from "@/pages/admin/analytics";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { useEffect, useState } from "react";
import AppLoading from "@/components/ui/app-loading";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/anime/:id" component={AnimeDetail} />
      <Route path="/watch/:animeId" component={WatchPage} />
      <Route path="/watch/:animeId/:seasonId" component={WatchPage} />
      <Route path="/watch/:animeId/:seasonId/:episodeId" component={WatchPage} />
      <Route path="/download/:episodeId" component={DownloadPage} />
      
      {/* User Protected Routes */}
      <ProtectedRoute path="/watchlist" component={WatchlistPage} />
      <ProtectedRoute path="/favorites" component={FavoritesPage} />
      
      {/* Admin Only Routes - explicitly marked as adminOnly */}
      <ProtectedRoute path="/admin" component={AdminDashboard} adminOnly={true} />
      <ProtectedRoute path="/admin/anime" component={AdminAnimeList} adminOnly={true} />
      <ProtectedRoute path="/admin/anime/:id/edit" component={AdminAnimeEdit} adminOnly={true} />
      <ProtectedRoute path="/admin/anime/:id/seasons" component={AdminSeasonManagement} adminOnly={true} />
      <ProtectedRoute path="/admin/anime/:id/episodes" component={AdminEpisodeManagement} adminOnly={true} />
      <ProtectedRoute path="/admin/users" component={AdminUserManagement} adminOnly={true} />
      <ProtectedRoute path="/admin/sessions" component={AdminUserSessions} adminOnly={true} />
      <ProtectedRoute path="/admin/analytics" component={AdminAnalytics} adminOnly={true} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time to show the animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {isLoading ? (
          <AppLoading />
        ) : (
          <>
            <Router />
            <Toaster />
          </>
        )}
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
