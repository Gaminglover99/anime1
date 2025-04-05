import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Anime, Season, InsertSeason, insertSeasonSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SeasonManagementProps {
  animeId: number;
  onSwitchToEpisodes: (seasonId: number) => void;
}

const SeasonManagement = ({ animeId, onSwitchToEpisodes }: SeasonManagementProps) => {
  const { toast } = useToast();
  const [seasonToDelete, setSeasonToDelete] = useState<Season | null>(null);

  // Fetch anime details
  const { data: animeResponse } = useQuery<{data: Anime}>({
    queryKey: ["/api/animes", animeId],
  });
  
  const anime = animeResponse?.data;

  // Fetch seasons
  const { data: seasonsResponse, isLoading } = useQuery<{data: Season[]}>({
    queryKey: ["/api/animes", animeId, "seasons"],
  });
  
  const seasons = seasonsResponse?.data;

  const form = useForm<InsertSeason>({
    resolver: zodResolver(insertSeasonSchema),
    defaultValues: {
      animeId: animeId,
      number: 1,
      title: "",
    },
  });

  // Create season
  const createMutation = useMutation({
    mutationFn: async (data: InsertSeason) => {
      return await apiRequest("POST", "/api/seasons", data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animes", animeId, "seasons"] });
      
      toast({
        title: "Season created",
        description: "The season has been successfully created.",
      });
      
      form.reset({
        animeId: animeId,
        number: (seasons?.length || 0) + 1,
        title: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create season",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete season
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/seasons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animes", animeId, "seasons"] });
      
      toast({
        title: "Season deleted",
        description: "The season has been successfully deleted.",
      });
      
      setSeasonToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete season",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSeason) => {
    createMutation.mutate(data);
  };

  const handleDelete = (season: Season) => {
    setSeasonToDelete(season);
  };

  const confirmDelete = () => {
    if (seasonToDelete) {
      deleteMutation.mutate(seasonToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#222] rounded-lg p-6 shadow-lg">
      <Tabs defaultValue="seasons">
        <TabsList className="mb-6">
          <TabsTrigger value="seasons" className="data-[state=active]:bg-blue-600">
            Seasons
          </TabsTrigger>
          <TabsTrigger value="episodes" className="data-[state=active]:bg-blue-600" disabled>
            Episodes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="seasons">
          <div className="bg-[#1a1a1a] rounded-lg p-6 shadow-md mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              Add Season for: {anime?.title}
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Add seasons to organize episodes. Each season can contain multiple episodes.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            value={field.value.toString()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter season title"
                            {...field}
                            className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-700 hover:bg-gray-600 text-white border-none"
                    onClick={() => form.reset()}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : null}
                    Create Season
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          <div className="mt-6 space-y-3">
            {seasons && seasons.length > 0 ? (
              seasons.map((season) => (
                <div
                  key={season.id}
                  className="bg-blue-600 text-white rounded-md px-6 py-3 shadow-sm flex justify-between items-center group"
                >
                  <span>
                    Season {season.number}: {season.title}
                  </span>
                  <div className="space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-blue-700"
                      onClick={() => onSwitchToEpisodes(season.id)}
                    >
                      Manage Episodes
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-red-600"
                      onClick={() => handleDelete(season)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No seasons found. Create your first season above.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!seasonToDelete} onOpenChange={() => setSeasonToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this season?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete Season {seasonToDelete?.number}: {seasonToDelete?.title} and all its episodes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
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

export default SeasonManagement;
