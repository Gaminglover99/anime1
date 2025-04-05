import { Link } from "wouter";
import { Settings, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminHeaderProps {
  title: string;
}

const AdminHeader = ({ title }: AdminHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="bg-[#222] border-b border-gray-800 shadow-md">
      <div className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        
        <div className="flex items-center space-x-2">
          <Link href="/">
            <a className="flex items-center text-gray-300 hover:text-white px-3 py-1 rounded-md text-sm">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
              </svg>
              Back to Site
            </a>
          </Link>
        </div>
      </div>
      
      <div className="flex items-center justify-between py-3 px-4 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <a className="px-4 py-1.5 bg-[#ff3a3a] rounded-md font-medium text-sm text-white">
              Home
            </a>
          </Link>
          <Link href="/watchlist">
            <a className="px-4 py-1.5 bg-gray-700 rounded-md font-medium text-sm text-white hover:bg-gray-600 transition-colors">
              Watchlist
            </a>
          </Link>
          <Link href="/favorites">
            <a className="px-4 py-1.5 bg-gray-700 rounded-md font-medium text-sm text-white hover:bg-gray-600 transition-colors">
              Favorites
            </a>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="text-gray-300 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-gray-300 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <Avatar className="h-8 w-8 bg-gray-500">
            <AvatarFallback>
              {user?.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
