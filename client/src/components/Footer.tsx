import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-[#1E1E1E] mt-12 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 font-poppins text-[#6C5CE7]">
              Anime<span className="text-[#FF3860]">Oasis</span>
            </h3>
            <p className="text-[#BBBBBB] mb-4">
              Your gateway to the world of anime. Stream thousands of episodes from your favorite series, all in one place.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#BBBBBB] hover:text-[#6C5CE7]">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-[#BBBBBB] hover:text-[#6C5CE7]">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-[#BBBBBB] hover:text-[#6C5CE7]">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-[#BBBBBB] hover:text-[#6C5CE7]">
                <i className="fab fa-discord text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/anime">
                  <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">Browse Anime</a>
                </Link>
              </li>
              <li>
                <Link href="/movies">
                  <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">Movies</a>
                </Link>
              </li>
              <li>
                <Link href="/new-releases">
                  <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">New Releases</a>
                </Link>
              </li>
              <li>
                <Link href="/my-list">
                  <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">My List</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Help & Info</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">Pricing Plans</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">FAQ</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">Terms of Service</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition">Privacy Policy</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3 text-[#BBBBBB]"></i>
                <span className="text-[#BBBBBB]">support@animeoasis.com</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone mt-1 mr-3 text-[#BBBBBB]"></i>
                <span className="text-[#BBBBBB]">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-[#BBBBBB]"></i>
                <span className="text-[#BBBBBB]">123 Anime Street, Tokyo, Japan</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#BBBBBB] text-sm">&copy; 2023 AnimeOasis. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/terms">
              <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition text-sm">Terms</a>
            </Link>
            <Link href="/privacy">
              <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition text-sm">Privacy</a>
            </Link>
            <Link href="/cookies">
              <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition text-sm">Cookies</a>
            </Link>
            <Link href="/licenses">
              <a className="text-[#BBBBBB] hover:text-[#6C5CE7] transition text-sm">Licenses</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
