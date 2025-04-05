import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard,
  Film,
  Users,
  UserCog,
  ChartBarStacked,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const AdminSidebar = () => {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: "/admin"
    },
    {
      id: "anime",
      label: "Anime Management",
      icon: <Film className="w-5 h-5" />,
      href: "/admin/anime"
    },
    {
      id: "users",
      label: "User Management",
      icon: <Users className="w-5 h-5" />,
      href: "/admin/users"
    },
    {
      id: "sessions",
      label: "User Sessions",
      icon: <UserCog className="w-5 h-5" />,
      href: "/admin/sessions"
    },
    {
      id: "analytics",
      label: "Download Analytics",
      icon: <ChartBarStacked className="w-5 h-5" />,
      href: "/admin/analytics"
    }
  ];

  const isActive = (path: string) => {
    if (path === "/admin" && location === "/admin") return true;
    if (path !== "/admin" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="w-52 bg-[#222] border-r border-gray-800 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <Link href="/">
          <a className="flex items-center">
            <span className="font-bold text-lg">
              <span className="text-[#ff3a3a]">Anime</span> Kingdom
            </span>
          </a>
        </Link>
      </div>
      
      <div className="px-2 py-4 text-sm text-gray-400 font-medium">
        ADMINISTRATION
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {navItems.map(item => (
            <li key={item.id} className="mb-1">
              <Link href={item.href}>
                <a className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${
                  isActive(item.href)
                    ? "sidebar-active text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                style={isActive(item.href) ? { borderLeft: "3px solid #ff3a3a", backgroundColor: "rgba(255, 58, 58, 0.1)" } : {}}>
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => logoutMutation.mutate()}
          className="flex items-center px-4 py-2 w-full text-gray-300 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
