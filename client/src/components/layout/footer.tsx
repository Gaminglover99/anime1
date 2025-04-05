import { Link, useLocation } from "wouter";
import { Instagram, Youtube } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { AboutDialog } from "../dialogs/about-dialog";
import { ContactDialog } from "../dialogs/contact-dialog";
import { RequestDialog } from "../dialogs/request-dialog";

const Footer = () => {
  const [, setLocation] = useLocation();
  
  // Redirect functions for Movies and TV Series
  const goToMovies = () => {
    setLocation("/search?type=Movie");
  };
  
  const goToTvSeries = () => {
    setLocation("/search?type=TV");
  };
  
  return (
    <footer className="bg-[#222] pt-12 pb-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Anime Kingdom</h3>
            <p className="text-sm text-gray-400 mb-4">
              The best place to watch and download anime online for free.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ff3a3a] transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ff3a3a] transition-colors">
                <SiDiscord size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ff3a3a] transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Browse</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-[#ff3a3a] transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <a onClick={goToMovies} className="text-gray-400 hover:text-[#ff3a3a] transition-colors cursor-pointer">
                  Movies
                </a>
              </li>
              <li>
                <a onClick={goToTvSeries} className="text-gray-400 hover:text-[#ff3a3a] transition-colors cursor-pointer">
                  TV Series
                </a>
              </li>
              <li>
                <Link href="/anime/popular">
                  <a className="text-gray-400 hover:text-[#ff3a3a] transition-colors">Popular</a>
                </Link>
              </li>
              <li>
                <Link href="/genres">
                  <a className="text-gray-400 hover:text-[#ff3a3a] transition-colors">Genres</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <AboutDialog>
                  <a className="text-gray-400 hover:text-[#ff3a3a] transition-colors cursor-pointer">About Us</a>
                </AboutDialog>
              </li>
              <li>
                <ContactDialog>
                  <a className="text-gray-400 hover:text-[#ff3a3a] transition-colors cursor-pointer">Contact</a>
                </ContactDialog>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-gray-400 hover:text-[#ff3a3a] transition-colors">FAQ</a>
                </Link>
              </li>
              <li>
                <RequestDialog>
                  <a className="text-gray-400 hover:text-[#ff3a3a] transition-colors cursor-pointer">Request Anime</a>
                </RequestDialog>
              </li>
              <li>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ff3a3a] transition-colors">
                  Join Discord
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth">
                  <a className="text-gray-400 hover:text-[#ff3a3a] transition-colors">Login</a>
                </Link>
              </li>
              <li>
                <Link href="/auth">
                  <a className="text-gray-400 hover:text-[#ff3a3a] transition-colors">Register</a>
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <a className="text-gray-400 hover:text-[#ff3a3a] transition-colors">Profile</a>
                </Link>
              </li>
              <li>
                <Link href="/watchlist">
                  <a className="text-gray-400 hover:text-[#ff3a3a] transition-colors">Watch List</a>
                </Link>
              </li>
              <li>
                <Link href="/admin">
                  <a className="text-gray-400 hover:text-[#ff3a3a] transition-colors">Admin Panel</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 mt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Anime Kingdom. All rights reserved.</p>
          <div className="mt-1">
            <span>Made with </span>
            <span className="text-[#ff3a3a]">♥</span>
            <span> by anime fans</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
