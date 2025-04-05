import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Season, Episode, InsertEpisode, InsertVideoSource, insertEpisodeSchema, insertVideoSourceSchema } from "@shared/schema";
import { apiRequest, queryClient, throwIfResNotOk } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Edit, Save } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EpisodeManagementProps {
  animeId: number;
  initialSeasonId?: number;
  onSwitchToSeasons: () => void;
}

const EpisodeManagement = ({ animeId, initialSeasonId, onSwitchToSeasons }: EpisodeManagementProps) => {
  const { toast } = useToast();
  const [episodeToDelete, setEpisodeToDelete] = useState<Episode | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [videoSources, setVideoSources] = useState<{ quality: string; url: string; isDownloadable?: boolean }[]>([
    { quality: "360p", url: "", isDownloadable: false }
  ]);

  // Fetch anime's seasons
  const { data: seasonsResponse } = useQuery<{data: Season[]}>({
    queryKey: ["/api/animes", animeId, "seasons"],
  });
  
  const seasons = seasonsResponse?.data;

  // Form for creating episodes
  const form = useForm<InsertEpisode>({
    resolver: zodResolver(insertEpisodeSchema),
    defaultValues: {
      seasonId: initialSeasonId || 0,
      number: 1,
      title: "",
      description: "",
      duration: "24m",
      thumbnail: "",
    },
  });

  // Set initial seasonId when seasons are loaded
  useState(() => {
    if (seasons && seasons.length > 0 && !initialSeasonId) {
      form.setValue("seasonId", seasons[0].id);
    }
  });

  // Get selected season ID
  const selectedSeasonId = form.watch("seasonId");

  // Fetch episodes for the selected season
  const { data: episodesResponse, isLoading: isLoadingEpisodes } = useQuery<{data: Episode[]}>({
    queryKey: ["/api/seasons", selectedSeasonId, "episodes"],
    enabled: !!selectedSeasonId,
  });
  
  const episodes = episodesResponse?.data;

  // Create episode
  const createMutation = useMutation({
    mutationFn: async (data: { episode: InsertEpisode; videoSources: InsertVideoSource[] }) => {
      const episodeRes = await apiRequest("POST", "/api/episodes", data.episode);
      const episodeData = await episodeRes.json();
      
      // Create video sources for the episode
      await Promise.all(
        data.videoSources.map(source => 
          apiRequest("POST", "/api/video-sources", {
            ...source,
            episodeId: episodeData.id
          })
        )
      );
      
      return episodeData;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seasons", selectedSeasonId, "episodes"] });
      
      toast({
        title: "Episode created",
        description: "The episode has been successfully created with its video sources.",
      });
      
      // Reset form and video sources
      form.reset({
        seasonId: selectedSeasonId,
        number: (episodes?.length || 0) + 1,
        title: "",
        description: "",
        duration: "24m",
        thumbnail: "",
      });
      
      setVideoSources([{ quality: "360p", url: "", isDownloadable: false }]);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create episode",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete episode
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/episodes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seasons", selectedSeasonId, "episodes"] });
      
      toast({
        title: "Episode deleted",
        description: "The episode has been successfully deleted.",
      });
      
      setEpisodeToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete episode",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update episode
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number, episode: Partial<InsertEpisode>; videoSources: InsertVideoSource[] }) => {
      // Update episode details
      const episodeRes = await apiRequest("PATCH", `/api/episodes/${data.id}`, data.episode);
      const episodeData = await episodeRes.json();
      
      // First, fetch existing video sources
      const sourcesRes = await fetch(`/api/episodes/${data.id}/video-sources`);
      await throwIfResNotOk(sourcesRes);
      const existingSources = await sourcesRes.json();
      
      // Delete existing sources if they exist
      if (existingSources.length > 0) {
        await Promise.all(
          existingSources.map((source: any) => 
            apiRequest("DELETE", `/api/video-sources/${source.id}`)
          )
        );
      }
      
      // Create new video sources
      await Promise.all(
        data.videoSources.map(source => 
          apiRequest("POST", "/api/video-sources", {
            ...source,
            episodeId: data.id
          })
        )
      );
      
      return episodeData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seasons", selectedSeasonId, "episodes"] });
      
      toast({
        title: "Episode updated",
        description: "The episode has been successfully updated with its video sources.",
      });
      
      // Reset form and video sources
      form.reset({
        seasonId: selectedSeasonId,
        number: (episodes?.length || 0) + 1,
        title: "",
        description: "",
        duration: "24m",
        thumbnail: "",
      });
      
      setVideoSources([{ quality: "360p", url: "", isDownloadable: false }]);
      setEditingEpisode(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update episode",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertEpisode) => {
    // Validate video sources
    const validSources = videoSources.filter(source => source.url.trim() !== "");
    
    if (validSources.length === 0) {
      toast({
        title: "Missing video sources",
        description: "Please add at least one video source with a valid URL.",
        variant: "destructive",
      });
      return;
    }
    
    // If editing an existing episode, call update mutation
    if (editingEpisode) {
      updateMutation.mutate({
        id: editingEpisode.id,
        episode: data,
        videoSources: validSources.map(source => ({
          episodeId: editingEpisode.id,
          quality: source.quality,
          url: source.url,
          isDownloadable: source.isDownloadable || false
        }))
      });
    } else {
      // Otherwise create a new episode
      createMutation.mutate({ 
        episode: data,
        videoSources: validSources.map(source => ({
          episodeId: 0, // Will be set in the mutation function
          quality: source.quality,
          url: source.url,
          isDownloadable: source.isDownloadable || false
        }))
      });
    }
  };
  
  // Load episode data for editing
  const handleEdit = async (episode: Episode) => {
    try {
      // Fetch episode video sources
      const response = await fetch(`/api/episodes/${episode.id}/video-sources`);
      if (!response.ok) {
        throw new Error('Failed to fetch video sources');
      }
      
      const sources = await response.json();
      
      // Set form values
      form.reset({
        seasonId: episode.seasonId,
        number: episode.number,
        title: episode.title,
        description: episode.description || '',
        duration: episode.duration,
        thumbnail: episode.thumbnail || '',
      });
      
      // Set video sources
      if (sources && sources.length > 0) {
        setVideoSources(
          sources.map((source: any) => ({
            quality: source.quality,
            url: source.url,
            isDownloadable: source.isDownloadable || false,
          }))
        );
      } else {
        setVideoSources([{ quality: "360p", url: "", isDownloadable: false }]);
      }
      
      // Set the current editing episode
      setEditingEpisode(episode);
      
      // Scroll to the form
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      toast({
        title: "Editing Episode",
        description: `Now editing Episode ${episode.number}: ${episode.title}`,
      });
    } catch (error) {
      toast({
        title: "Failed to load episode data",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const handleDelete = (episode: Episode) => {
    setEpisodeToDelete(episode);
  };

  const confirmDelete = () => {
    if (episodeToDelete) {
      deleteMutation.mutate(episodeToDelete.id);
    }
  };

  const addVideoQuality = () => {
    setVideoSources([...videoSources, { quality: "480p", url: "", isDownloadable: false }]);
  };

  const removeVideoQuality = (index: number) => {
    if (videoSources.length > 1) {
      const newSources = [...videoSources];
      newSources.splice(index, 1);
      setVideoSources(newSources);
    }
  };

  const updateVideoSource = (index: number, field: "quality" | "url" | "isDownloadable", value: string | boolean) => {
    const newSources = [...videoSources];
    newSources[index] = { ...newSources[index], [field]: value };
    setVideoSources(newSources);
  };

  if (!seasons || seasons.length === 0) {
    return (
      <div className="bg-[#222] rounded-lg p-6 shadow-lg">
        <p className="text-white text-center">
          No seasons found. Please create a season first.
        </p>
        <div className="flex justify-center mt-4">
          <Button onClick={onSwitchToSeasons} className="bg-blue-600 hover:bg-blue-700">
            Manage Seasons
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#222] rounded-lg p-6 shadow-lg">
      <Tabs defaultValue="episodes">
        <TabsList className="mb-6">
          <TabsTrigger value="seasons" onClick={onSwitchToSeasons} className="data-[state=active]:bg-blue-600">
            Seasons
          </TabsTrigger>
          <TabsTrigger value="episodes" className="data-[state=active]:bg-blue-600">
            Episodes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="episodes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="seasonId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value.toString()}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]">
                              <SelectValue placeholder="Select season" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            {seasons.map(season => (
                              <SelectItem key={season.id} value={season.id.toString()}>
                                Season {season.number}: {season.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Episode Number</FormLabel>
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
                        <FormLabel>Episode Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter episode title"
                            {...field}
                            className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter episode description"
                            {...field}
                            value={field.value || ''}
                            className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="24m"
                            {...field}
                            className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter thumbnail URL"
                            {...field}
                            value={field.value || ''}
                            className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
            
            <div>
              <div className="bg-blue-900 bg-opacity-30 text-blue-100 p-4 rounded-md mb-4">
                <h3 className="font-medium flex items-center text-blue-200 mb-2">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  {editingEpisode 
                    ? `Editing Episode ${editingEpisode.number}: ${editingEpisode.title}` 
                    : `New Episode for: ${seasons.find(s => s.id === selectedSeasonId)?.title || "Selected Season"}`}
                </h3>
                <p className="text-sm">Add videos in multiple qualities to provide flexible streaming options. Make sure your video URLs are valid and accessible.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Video Sources</label>
                <p className="text-xs text-gray-400 mb-2">Add direct video URLs or YouTube links</p>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-6 gap-2">
                    <div className="col-span-1">
                      <div className="block text-xs font-medium text-gray-300 mb-1">Quality</div>
                    </div>
                    <div className="col-span-4">
                      <div className="block text-xs font-medium text-gray-300 mb-1">URL</div>
                    </div>
                    <div className="col-span-1">
                      <div className="block text-xs font-medium text-gray-300 mb-1">Downloadable</div>
                    </div>
                  </div>
                  
                  {videoSources.map((source, index) => (
                    <div key={index} className="grid grid-cols-6 gap-2 items-center">
                      <div className="col-span-1">
                        <Select
                          value={source.quality}
                          onValueChange={(value) => updateVideoSource(index, "quality", value)}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white text-sm focus:border-[#ff3a3a]">
                            <SelectValue placeholder="Quality" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="360p">360p</SelectItem>
                            <SelectItem value="480p">480p</SelectItem>
                            <SelectItem value="720p">720p</SelectItem>
                            <SelectItem value="1080p">1080p</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-4">
                        <Input
                          value={source.url}
                          onChange={(e) => updateVideoSource(index, "url", e.target.value)}
                          placeholder="Video URL"
                          className="bg-gray-800 border-gray-700 text-white text-sm focus:border-[#ff3a3a]"
                        />
                      </div>
                      <div className="col-span-1 flex items-center">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`downloadable-${index}`}
                            checked={source.isDownloadable || false} 
                            onCheckedChange={(checked) => 
                              updateVideoSource(index, "isDownloadable", checked === true)
                            }
                            className="data-[state=checked]:bg-[#ff3a3a] border-gray-500"
                          />
                          <label
                            htmlFor={`downloadable-${index}`}
                            className="text-xs text-gray-300 cursor-pointer"
                          >
                            Downloadable
                          </label>
                        </div>
                        {videoSources.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-400"
                            onClick={() => removeVideoQuality(index)}
                            type="button"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                      onClick={addVideoQuality}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Quality
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="h-40 bg-gray-800 mt-4 rounded-md flex items-center justify-center overflow-hidden">
                {form.watch("thumbnail") && typeof form.watch("thumbnail") === 'string' && form.watch("thumbnail").length > 0 ? (
                  <img
                    src={form.watch("thumbnail") as string}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/640x360?text=Error+Loading+Image";
                    }}
                  />
                ) : (
                  <div className="text-gray-500 text-sm">Thumbnail Preview</div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                {editingEpisode ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-700 hover:bg-gray-600 text-white border-none"
                    onClick={() => {
                      // Reset form to default values
                      form.reset({
                        seasonId: selectedSeasonId,
                        number: (episodes?.length || 0) + 1,
                        title: "",
                        description: "",
                        duration: "24m",
                        thumbnail: "",
                      });
                      
                      // Reset video sources
                      setVideoSources([{ quality: "360p", url: "", isDownloadable: false }]);
                      
                      // Clear editing state
                      setEditingEpisode(null);
                      
                      toast({
                        title: "Edit cancelled",
                        description: "Returned to episode creation mode.",
                      });
                    }}
                  >
                    Cancel Edit
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-700 hover:bg-gray-600 text-white border-none"
                    onClick={() => {
                      form.reset({
                        seasonId: selectedSeasonId,
                        number: (episodes?.length || 0) + 1,
                        title: "",
                        description: "",
                        duration: "24m",
                        thumbnail: "",
                      });
                      setVideoSources([{ quality: "360p", url: "", isDownloadable: false }]);
                    }}
                  >
                    Reset
                  </Button>
                )}
                <Button
                  type="button"
                  className={`${editingEpisode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#ff3a3a] hover:bg-red-700'} text-white`}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : editingEpisode ? (
                    <Save className="h-4 w-4 mr-1" />
                  ) : (
                    <Plus className="h-4 w-4 mr-1" />
                  )}
                  {editingEpisode ? 'Save Changes' : 'Create Episode'}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Episodes List</h3>
            {isLoadingEpisodes ? (
              <div className="flex justify-center items-center h-32">
                <div className="w-8 h-8 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : episodes && episodes.length > 0 ? (
              <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Duration
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {episodes.map((episode) => (
                      <tr 
                        key={episode.id} 
                        className={`hover:bg-gray-800 transition-colors ${editingEpisode?.id === episode.id ? 'bg-blue-900 bg-opacity-30' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {episode.number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {episode.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {episode.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-500 hover:text-blue-400"
                            onClick={() => handleEdit(episode)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-400"
                            onClick={() => handleDelete(episode)}
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 bg-[#1a1a1a] rounded-lg">
                No episodes found for this season. Create your first episode above.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!episodeToDelete} onOpenChange={() => setEpisodeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this episode?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete Episode {episodeToDelete?.number}: {episodeToDelete?.title} and all its video sources.
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

export default EpisodeManagement;
