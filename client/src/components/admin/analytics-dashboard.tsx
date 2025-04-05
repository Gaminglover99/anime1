import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown, Users, Database, Gauge } from "lucide-react";

// Mock data for analytics
// In a real app, this would come from the API
const generateMockAnalyticsData = () => {
  return {
    totalDownloads: 145287,
    totalDownloadsChange: 12.5,
    activeDownloads: 234,
    activeDownloadsChange: 3.2,
    averageSpeed: "4.3 MB/s",
    averageSpeedChange: -0.8,
    totalBandwidth: "24.7 TB",
    totalBandwidthChange: 18.3,
    downloadTrends: Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1}`,
      downloads: Math.floor(3000 + Math.random() * 2000),
    })),
    topDownloadedAnimes: [
      { id: 1, title: "Attack on Titan", season: "Season 4", downloads: 18342, image: "https://via.placeholder.com/60x80" },
      { id: 2, title: "Demon Slayer", season: "Season 2", downloads: 15721, image: "https://via.placeholder.com/60x80" },
      { id: 3, title: "Jujutsu Kaisen", season: "Season 1", downloads: 14583, image: "https://via.placeholder.com/60x80" },
      { id: 4, title: "My Hero Academia", season: "Season 5", downloads: 11847, image: "https://via.placeholder.com/60x80" },
      { id: 5, title: "One Piece", season: "Latest Episodes", downloads: 10932, image: "https://via.placeholder.com/60x80" },
    ],
  };
};

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("7");

  // In a real app, this would be a query to the backend
  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics", timeRange],
    queryFn: () => Promise.resolve(generateMockAnalyticsData()),
    initialData: generateMockAnalyticsData(),
  });

  const handleExport = () => {
    // In a real app, this would generate a CSV or Excel file
    alert("Analytics data exported (this would be a real export in production)");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Download Analytics</h1>
        <div className="flex space-x-2">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-44">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="bg-gray-700 hover:bg-gray-600 text-white border-none"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <Card className="bg-[#222] text-white border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Downloads</p>
                <h3 className="text-2xl font-bold mt-1">{analytics.totalDownloads.toLocaleString()}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Download className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 text-xs font-medium text-green-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {analytics.totalDownloadsChange}% increase
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#222] text-white border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Downloads</p>
                <h3 className="text-2xl font-bold mt-1">{analytics.activeDownloads}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 text-xs font-medium text-blue-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {analytics.activeDownloadsChange}% increase
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#222] text-white border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Average Speed</p>
                <h3 className="text-2xl font-bold mt-1">{analytics.averageSpeed}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Gauge className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 text-xs font-medium text-red-500 flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" />
              {Math.abs(analytics.averageSpeedChange)}% decrease
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#222] text-white border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Bandwidth</p>
                <h3 className="text-2xl font-bold mt-1">{analytics.totalBandwidth}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 text-xs font-medium text-green-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {analytics.totalBandwidthChange}% increase
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="bg-[#222] text-white border-gray-700 xl:col-span-2">
          <CardHeader>
            <CardTitle>Download Trends</CardTitle>
            <CardDescription className="text-gray-400">
              Download activity over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analytics.downloadTrends}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="downloads"
                    stroke="#ff3a3a"
                    activeDot={{ r: 8 }}
                    name="Downloads"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#222] text-white border-gray-700">
          <CardHeader>
            <CardTitle>Top Downloaded Anime</CardTitle>
            <CardDescription className="text-gray-400">
              Most popular downloads in the selected time period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topDownloadedAnimes.map((anime) => (
                <div key={anime.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-14 rounded overflow-hidden">
                      <img
                        src={anime.image}
                        className="w-full h-full object-cover"
                        alt={anime.title}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium">{anime.title}</div>
                      <div className="text-xs text-gray-400">{anime.season}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{anime.downloads.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="bg-[#222] text-white border-gray-700">
          <CardHeader>
            <CardTitle>Downloads by Genre</CardTitle>
            <CardDescription className="text-gray-400">
              Distribution of downloads across different genres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { genre: "Action", downloads: 45287 },
                    { genre: "Adventure", downloads: 38124 },
                    { genre: "Comedy", downloads: 32876 },
                    { genre: "Romance", downloads: 28541 },
                    { genre: "Fantasy", downloads: 26932 },
                    { genre: "Sci-Fi", downloads: 21456 },
                    { genre: "Drama", downloads: 18923 },
                    { genre: "Horror", downloads: 12689 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="genre" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Bar dataKey="downloads" name="Downloads" fill="#ff3a3a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
