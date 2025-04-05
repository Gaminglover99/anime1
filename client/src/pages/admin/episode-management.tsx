import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/admin-layout";
import EpisodeManagement from "@/components/admin/episode-management";
import { Anime } from "@shared/schema";

const EpisodeManagementPage = () => {
  const { id } = useParams<{ id: string }>();
  const animeId = parseInt(id);

  // Fetch anime details for title
  const { data: anime, isLoading } = useQuery<Anime>({
    queryKey: ["/api/animes", animeId],
  });

  const title = isLoading
    ? "Manage Episodes"
    : `Manage ${anime?.title} Episodes`;

  return (
    <AdminLayout title={title}>
      <EpisodeManagement 
        animeId={animeId} 
        onSwitchToSeasons={() => {}}
      />
    </AdminLayout>
  );
};

export default EpisodeManagementPage;
