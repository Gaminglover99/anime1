import { Link, useLocation } from "wouter";
import { 
  Home, 
  ListVideo, 
  Heart, 
  Film, 
  Clock, 
  Settings,
  BookOpen
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="w-5 h-5" />,
      href: "/"
    },
    {
      id: "movies",
      label: "Movies",
      icon: <Film className="w-5 h-5" />,
      href: "/anime/movies"
    },
    {
      id: "tv",
      label: "TV Series",
      icon: <ListVideo className="w-5 h-5" />,
      href: "/anime/tv"
    },
    {
      id: "popular",
      label: "Popular",
      icon: <Clock className="w-5 h-5" />,
      href: "/anime/popular"
    },
    {
      id: "genres",
      label: "Genres",
      icon: <BookOpen className="w-5 h-5" />,
      href: "/genres"
    },
    {
      id: "watchlist",
      label: "Watchlist",
      icon: <ListVideo className="w-5 h-5" />,
      href: "/watchlist"
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: <Heart className="w-5 h-5" />,
      href: "/favorites"
    }
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#222] border-r border-gray-800 transition-transform duration-300 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:static md:z-0`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-800">
          <Link href="/">
            <a className="flex items-center">
              <span className="font-bold text-lg">
                <span className="text-[#ff3a3a]">Anime</span> Kingdom
              </span>
            </a>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navItems.map(item => (
              <Link key={item.id} href={item.href}>
                <a 
                  className={`flex items-center px-3 py-2 rounded-md ${
                    isActive(item.href)
                      ? "bg-[#ff3a3a] bg-opacity-10 text-[#ff3a3a]"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </a>
              </Link>
            ))}
          </nav>
        </div>
        
        {user && (
          <div className="p-4 border-t border-gray-800">
            <Link href="/settings">
              <a className="flex items-center px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white">
                <Settings className="w-5 h-5" />
                <span className="ml-3">Settings</span>
              </a>
            </Link>
            
            {user.role === "Admin" && (
              <Link href="/admin">
                <a className="flex items-center px-3 py-2 mt-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-3">Admin Dashboard</span>
                </a>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
