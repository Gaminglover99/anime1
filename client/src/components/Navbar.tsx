import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";
import { Search, Menu, User } from "lucide-react";

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
    setUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold font-poppins text-[#6C5CE7]">
                Anime<span className="text-[#FF3860]">Oasis</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a className={`hover:text-[#6C5CE7] transition font-medium ${
                location === "/" ? "text-white" : "text-[#BBBBBB]"
              }`}>
                Home
              </a>
            </Link>
            <Link href="/anime">
              <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition font-medium">
                Anime
              </a>
            </Link>
            <Link href="/movies">
              <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition font-medium">
                Movies
              </a>
            </Link>
            <Link href="/new-releases">
              <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition font-medium">
                New Releases
              </a>
            </Link>
            <Link href="/watchlist">
              <a className={`hover:text-[#6C5CE7] transition font-medium ${
                location === "/watchlist" ? "text-white" : "text-[#BBBBBB]"
              }`}>
                My List
              </a>
            </Link>
          </nav>
          
          {/* Right-side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <button 
                className="text-[#BBBBBB] hover:text-[#6C5CE7] p-1"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="h-5 w-5" />
              </button>
              {searchOpen && (
                <input 
                  type="text" 
                  placeholder="Search anime..." 
                  className="absolute right-0 top-10 bg-[#1E1E1E] border border-gray-700 rounded py-2 px-4 w-64 text-white focus:outline-none focus:ring-1 focus:ring-[#6C5CE7]"
                  autoFocus
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                />
              )}
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-[#2D2D2D] flex items-center justify-center overflow-hidden">
                  {user ? (
                    <span className="text-[#6C5CE7] font-bold uppercase">
                      {user.username.charAt(0)}
                    </span>
                  ) : (
                    <User className="h-5 w-5 text-[#BBBBBB]" />
                  )}
                </div>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-[#1E1E1E] rounded-md shadow-xl z-20 border border-gray-700">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm font-semibold text-white border-b border-gray-700">
                        {user.username}
                        {user.role === "Admin" && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-[#6C5CE7] rounded-sm">
                            Admin
                          </span>
                        )}
                      </div>
                      <Link href="/profile">
                        <a className="block px-4 py-2 text-sm text-white hover:bg-[#2D2D2D]">
                          Profile
                        </a>
                      </Link>
                      <Link href="/watchlist">
                        <a className="block px-4 py-2 text-sm text-white hover:bg-[#2D2D2D]">
                          Watchlist
                        </a>
                      </Link>
                      <Link href="/favorites">
                        <a className="block px-4 py-2 text-sm text-white hover:bg-[#2D2D2D]">
                          Favorites
                        </a>
                      </Link>
                      
                      {user.role === "Admin" && (
                        <>
                          <div className="border-t border-gray-700 my-1"></div>
                          <Link href="/admin">
                            <a className="block px-4 py-2 text-sm font-semibold text-[#6C5CE7] hover:bg-[#2D2D2D]">
                              Admin Panel
                            </a>
                          </Link>
                        </>
                      )}
                      
                      <div className="border-t border-gray-700 my-1"></div>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2D2D2D]"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth">
                        <a className="block px-4 py-2 text-sm text-white hover:bg-[#2D2D2D]">
                          Login
                        </a>
                      </Link>
                      <Link href="/auth?register=true">
                        <a className="block px-4 py-2 text-sm text-white hover:bg-[#2D2D2D]">
                          Register
                        </a>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-300 hover:text-white focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1E1E1E] border-t border-gray-800 py-2">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col space-y-3 py-3">
              <Link href="/">
                <a className={`hover:text-[#6C5CE7] transition font-medium py-2 ${
                  location === "/" ? "text-white" : "text-[#BBBBBB]"
                }`}>
                  Home
                </a>
              </Link>
              <Link href="/anime">
                <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition font-medium py-2">
                  Anime
                </a>
              </Link>
              <Link href="/movies">
                <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition font-medium py-2">
                  Movies
                </a>
              </Link>
              <Link href="/new-releases">
                <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition font-medium py-2">
                  New Releases
                </a>
              </Link>
              <Link href="/watchlist">
                <a className={`hover:text-[#6C5CE7] transition font-medium py-2 ${
                  location === "/watchlist" ? "text-white" : "text-[#BBBBBB]"
                }`}>
                  Watchlist
                </a>
              </Link>
              <Link href="/favorites">
                <a className={`hover:text-[#6C5CE7] transition font-medium py-2 ${
                  location === "/favorites" ? "text-white" : "text-[#BBBBBB]"
                }`}>
                  Favorites
                </a>
              </Link>
              
              {user?.role === "Admin" && (
                <Link href="/admin">
                  <a className="text-[#6C5CE7] font-semibold hover:text-[#8D70FF] transition py-2">
                    Admin Panel
                  </a>
                </Link>
              )}
              
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Search anime..." 
                  className="w-full bg-[#121212] py-2 px-4 rounded text-white focus:outline-none focus:ring-1 focus:ring-[#6C5CE7]"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#BBBBBB]">
                  <Search className="h-4 w-4" />
                </button>
              </div>
              
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="text-left text-[#BBBBBB] hover:text-[#6C5CE7] transition font-medium py-2"
                >
                  Logout
                </button>
              ) : (
                <Link href="/auth">
                  <a className="text-[#6C5CE7] font-semibold hover:text-[#8D70FF] transition py-2">
                    Login / Register
                  </a>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
