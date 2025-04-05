import { apiRequest } from "./queryClient";

// Anime API
export const getAnimes = async () => {
  const res = await apiRequest("GET", "/api/animes");
  return await res.json();
};

export const getAnimeById = async (id: number) => {
  const res = await apiRequest("GET", `/api/animes/${id}`);
  return await res.json();
};

export const getFeaturedAnime = async () => {
  const res = await apiRequest("GET", "/api/featured");
  return await res.json();
};

export const getPopularAnimes = async (limit = 10) => {
  const res = await apiRequest("GET", `/api/popular?limit=${limit}`);
  return await res.json();
};

export const getNewReleases = async () => {
  const res = await apiRequest("GET", "/api/new-releases");
  return await res.json();
};

// Genres
export const getGenres = async () => {
  const res = await apiRequest("GET", "/api/genres");
  return await res.json();
};

// User progress
export const getContinueWatching = async (userId: number) => {
  const res = await apiRequest("GET", `/api/user/${userId}/continue-watching`);
  return await res.json();
};

export const updateProgress = async (userId: number, episodeId: number, watchedSeconds: number, completed: boolean) => {
  const res = await apiRequest("POST", `/api/user/${userId}/progress`, {
    episodeId,
    watchedSeconds,
    completed
  });
  return await res.json();
};

// Watchlist
export const addToWatchlist = async (userId: number, animeId: number, status: string = "PlanToWatch") => {
  const res = await apiRequest("POST", `/api/user/${userId}/watchlist`, {
    animeId,
    status
  });
  return await res.json();
};

export const removeFromWatchlist = async (userId: number, animeId: number) => {
  const res = await apiRequest("DELETE", `/api/user/${userId}/watchlist/${animeId}`);
  return await res.json();
};

// News
export const getNews = async (limit = 3) => {
  const res = await apiRequest("GET", `/api/news?limit=${limit}`);
  return await res.json();
};
