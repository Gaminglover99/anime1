import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Edit, Eye, Trash, Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Anime } from "@shared/schema";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AnimeList = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [animeToDelete, setAnimeToDelete] = useState<Anime | null>(null);

  const { data: animesResponse, isLoading } = useQuery<{data: Anime[]}>({
    queryKey: ["/api/animes"],
  });
  
  // Extract the animes array from the response
  const animes = animesResponse?.data;

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/animes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animes"] });
      toast({
        title: "Anime deleted",
        description: "The anime has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete anime",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (anime: Anime) => {
    setAnimeToDelete(anime);
  };

  const confirmDelete = () => {
    if (animeToDelete) {
      deleteMutation.mutate(animeToDelete.id);
      setAnimeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setAnimeToDelete(null);
  };

  const getStatusBadgeClass = (status: string | null) => {
    if (!status) return "bg-gray-700";
    
    switch (status) {
      case "Ongoing":
        return "bg-blue-700";
      case "Completed":
        return "bg-green-700";
      case "Upcoming":
        return "bg-yellow-700";
      default:
        return "bg-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <span className="text-xl font-semibold text-white">
            {animes?.length || 0} Animes
          </span>
        </div>
        <Button 
          className="bg-[#ff3a3a] hover:bg-red-700 text-white"
          onClick={() => navigate("/admin/anime/new")}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New Anime
        </Button>
      </div>

      <div className="bg-[#222] rounded-lg overflow-hidden shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Anime
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Year
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-[#222]">
            {animes?.map((anime) => (
              <tr key={anime.id} className="hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-14 rounded overflow-hidden">
                      <img
                        className="h-10 w-full object-cover"
                        src={anime.coverImage || "https://via.placeholder.com/100x150?text=No+Image"}
                        alt={anime.title}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{anime.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {anime.releaseYear}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadgeClass(anime.status)} text-white`}>
                    {anime.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {anime.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-400 hover:text-blue-300"
                    onClick={() => navigate(`/admin/anime/${anime.id}/edit`)}
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-300"
                    asChild
                  >
                    <Link href={`/anime/${anime.id}`}>
                      <Eye className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-400"
                    onClick={() => handleDelete(anime)}
                  >
                    <Trash className="w-5 h-5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {animes && animes.length > 0 ? (
          <div className="border-t border-gray-700 px-6 py-3 text-gray-400 text-sm">
            Showing {animes.length} animes
          </div>
        ) : (
          <div className="border-t border-gray-700 px-6 py-3 text-gray-400 text-sm">
            No animes found
          </div>
        )}
      </div>

      <AlertDialog open={!!animeToDelete} onOpenChange={cancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-semibold">{animeToDelete?.title}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnimeList;
