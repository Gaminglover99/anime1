import AdminLayout from "@/components/admin/admin-layout";
import AnimeList from "@/components/admin/anime-list";

const AdminAnimeListPage = () => {
  return (
    <AdminLayout title="Anime Management">
      <AnimeList />
    </AdminLayout>
  );
};

export default AdminAnimeListPage;
