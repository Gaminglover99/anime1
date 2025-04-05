import { useParams } from "wouter";
import AdminLayout from "@/components/admin/admin-layout";
import AnimeEditForm from "@/components/admin/anime-edit-form";

const AnimeEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const animeId = id === "new" ? undefined : parseInt(id);
  const title = animeId ? "Edit Anime" : "Add New Anime";

  return (
    <AdminLayout title={title}>
      <div className="p-6">
        <AnimeEditForm animeId={animeId} />
      </div>
    </AdminLayout>
  );
};

export default AnimeEditPage;
