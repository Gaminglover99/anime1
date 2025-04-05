import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SearchAutocomplete from "@/components/search/search-autocomplete-fixed";
import { eventBus } from "@/lib/event-bus";

const Navbar = () => {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-[#222] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => {
                  eventBus.publish('reset-filters');
                  eventBus.publish('reset-search');
                }}
              >
                <span className="text-xl font-bold flex items-center">
                  <span className="text-2xl mr-2" role="img" aria-label="Anime Oasis">🐱</span>
                </span>
              </div>
            </Link>
            <div className="ml-6 flex space-x-2">
              <Link href="/">
                <div 
                  className="px-4 py-1.5 bg-[#ff3a3a] rounded-md font-medium text-sm text-white cursor-pointer"
                  onClick={() => {
                    eventBus.publish('reset-filters');
                    eventBus.publish('reset-search');
                  }}
                >
                  Home
                </div>
              </Link>
              <Link href="/watchlist">
                <div className="px-4 py-1.5 bg-gray-700 rounded-md font-medium text-sm text-white hover:bg-gray-600 transition-colors cursor-pointer">
                  Watchlist
                </div>
              </Link>
              <Link href="/favorites">
                <div className="px-4 py-1.5 bg-gray-700 rounded-md font-medium text-sm text-white hover:bg-gray-600 transition-colors cursor-pointer">
                  Favorites
                </div>
              </Link>
              {user && (user.role === "Admin" || user.role === "Manager") && (
                <Link href="/admin">
                  <div className="px-4 py-1.5 bg-purple-700 rounded-md font-medium text-sm text-white hover:bg-purple-600 transition-colors cursor-pointer">
                    {user.role === "Admin" ? "Admin" : "Manager"}
                  </div>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <SearchAutocomplete />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-600">
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <div className="w-full flex cursor-pointer">Profile</div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/watchlist">
                      <div className="w-full flex cursor-pointer">Watchlist</div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites">
                      <div className="w-full flex cursor-pointer">Favorites</div>
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === "Admin" || user.role === "Manager") && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <div className="w-full flex cursor-pointer">
                            {user.role === "Admin" ? "Admin Dashboard" : "Content Management"}
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth">
                  <div className="text-sm font-medium text-white hover:text-gray-300 transition-colors cursor-pointer">
                    Login
                  </div>
                </Link>
                <span className="text-gray-500">|</span>
                <Link href="/auth">
                  <div className="text-sm font-medium text-white hover:text-gray-300 transition-colors cursor-pointer">
                    Sign Up
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
