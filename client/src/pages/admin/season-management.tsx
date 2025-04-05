import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/admin-layout";
import SeasonManagement from "@/components/admin/season-management";
import EpisodeManagement from "@/components/admin/episode-management";
import { Anime } from "@shared/schema";

const SeasonManagementPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const animeId = parseInt(id);
  const [view, setView] = useState<"seasons" | "episodes">("seasons");
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | undefined>(undefined);

  // Fetch anime details for title
  const { data: anime, isLoading } = useQuery<Anime>({
    queryKey: ["/api/animes", animeId],
  });

  const handleSwitchToEpisodes = (seasonId: number) => {
    setSelectedSeasonId(seasonId);
    setView("episodes");
  };

  const handleSwitchToSeasons = () => {
    setView("seasons");
  };

  const title = isLoading
    ? "Manage Seasons & Episodes"
    : `Manage ${anime?.title} Seasons & Episodes`;

  return (
    <AdminLayout title={title}>
      <div className="p-6">
        {view === "seasons" ? (
          <SeasonManagement 
            animeId={animeId} 
            onSwitchToEpisodes={handleSwitchToEpisodes} 
          />
        ) : (
          <EpisodeManagement 
            animeId={animeId} 
            initialSeasonId={selectedSeasonId}
            onSwitchToSeasons={handleSwitchToSeasons} 
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default SeasonManagementPage;
