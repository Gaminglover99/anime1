import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Anime, User } from "@shared/schema";
import { Film, Users, ChartBarStacked, ListVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

// Mock data for demo purposes
const generateMockStats = () => {
  return {
    totalAnimes: 0,
    totalEpisodes: 0,
    totalUsers: 0,
    totalGenres: 0,
    recentActivity: {
      downloads: [
        { name: "Jan", count: 12 },
        { name: "Feb", count: 19 },
        { name: "Mar", count: 15 },
        { name: "Apr", count: 27 },
        { name: "May", count: 24 },
        { name: "Jun", count: 32 },
      ],
      users: [
        { name: "Jan", count: 5 },
        { name: "Feb", count: 8 },
        { name: "Mar", count: 12 },
        { name: "Apr", count: 15 },
        { name: "May", count: 20 },
        { name: "Jun", count: 25 },
      ],
    },
    popularGenres: [
      { name: "Action", count: 254 },
      { name: "Adventure", count: 189 },
      { name: "Comedy", count: 167 },
      { name: "Romance", count: 132 },
      { name: "Sci-Fi", count: 94 },
      { name: "Fantasy", count: 86 },
    ],
  };
};

const Dashboard = () => {
  const [, navigate] = useLocation();

  // Fetch animes for stats
  const { data: animesResponse } = useQuery<{data: Anime[]}>({
    queryKey: ["/api/animes"],
  });
  
  const animes = animesResponse?.data;

  // Fetch users for stats
  const { data: usersResponse } = useQuery<{data: User[]}>({
    queryKey: ["/api/users"],
  });
  
  const users = usersResponse?.data;

  // Mock data that should be replaced with real queries in production
  const stats = generateMockStats();

  // Calculate real stats from fetched data
  const totalAnimes = animes?.length || 0;
  const totalUsers = users?.length || 0;

  return (
    <AdminLayout title="Dashboard">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Animes */}
          <Card className="bg-[#222] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-500 bg-opacity-10 rounded-full">
                  <Film className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Animes</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{totalAnimes}</h3>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 border border-gray-700 hover:bg-gray-800"
                onClick={() => navigate("/admin/anime")}
              >
                View All
              </Button>
            </CardContent>
          </Card>

          {/* Total Episodes */}
          <Card className="bg-[#222] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-500 bg-opacity-10 rounded-full">
                  <ListVideo className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Episodes</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats.totalEpisodes}</h3>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 border border-gray-700 hover:bg-gray-800"
                onClick={() => navigate("/admin/anime")}
              >
                Manage Episodes
              </Button>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card className="bg-[#222] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-500 bg-opacity-10 rounded-full">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{totalUsers}</h3>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 border border-gray-700 hover:bg-gray-800"
                onClick={() => navigate("/admin/users")}
              >
                Manage Users
              </Button>
            </CardContent>
          </Card>

          {/* Total Genres */}
          <Card className="bg-[#222] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-amber-500 bg-opacity-10 rounded-full">
                  <ChartBarStacked className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Genres</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats.totalGenres}</h3>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 border border-gray-700 hover:bg-gray-800"
                onClick={() => navigate("/admin/analytics")}
              >
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Growth Chart */}
          <Card className="bg-[#222] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Site Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats.recentActivity.downloads}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Downloads"
                      stroke="#ff3a3a"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Popular Genres */}
          <Card className="bg-[#222] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Popular Genres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={stats.popularGenres}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis type="number" stroke="#888" />
                    <YAxis dataKey="name" type="category" stroke="#888" width={80} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Bar dataKey="count" name="Downloads" fill="#ff3a3a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Anime */}
          <Card className="bg-[#222] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Animes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {animes && animes.length > 0 ? (
                  animes.slice(0, 5).map((anime) => (
                    <div key={anime.id} className="flex items-center space-x-4">
                      <div className="w-10 h-14 bg-gray-700 rounded overflow-hidden">
                        {anime.coverImage ? (
                          <img
                            src={anime.coverImage}
                            alt={anime.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{anime.title}</h4>
                        <div className="flex text-xs text-gray-400 mt-1">
                          <span>{anime.type}</span>
                          <span className="mx-2">•</span>
                          <span>{anime.releaseYear}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate(`/admin/anime/${anime.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    No anime data available
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-6 border border-gray-700 hover:bg-gray-800"
                onClick={() => navigate("/admin/anime")}
              >
                View All Animes
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-[#222] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <Button
                  className="bg-[#ff3a3a] hover:bg-red-700 w-full"
                  onClick={() => navigate("/admin/anime/new")}
                >
                  Add New Anime
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={() => navigate("/admin/anime")}
                >
                  Manage Anime
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 w-full"
                  onClick={() => navigate("/admin/analytics")}
                >
                  View Analytics
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 w-full"
                  onClick={() => navigate("/admin/users")}
                >
                  Manage Users
                </Button>
                <Button
                  className="bg-gray-600 hover:bg-gray-700 w-full"
                  onClick={() => navigate("/admin/sessions")}
                >
                  View Active Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
