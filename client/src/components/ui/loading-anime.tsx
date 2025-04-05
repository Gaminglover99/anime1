import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type LoadingAnimeProps = {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
};

const mascots = [
  {
    name: "Happy Pikachu",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#FFC107"/>
      <circle cx="35" cy="40" r="5" fill="black"/>
      <circle cx="65" cy="40" r="5" fill="black"/>
      <path d="M40 60 Q50 70 60 60" stroke="black" stroke-width="2" fill="none"/>
      <path d="M20 30 L35 35" stroke="black" stroke-width="3"/>
      <path d="M80 30 L65 35" stroke="black" stroke-width="3"/>
      <path d="M25 80 L40 65 M75 80 L60 65" stroke="black" stroke-width="3"/>
    </svg>`
  },
  {
    name: "Cute Totoro",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#808080"/>
      <circle cx="35" cy="40" r="5" fill="white"/>
      <circle cx="35" cy="40" r="2" fill="black"/>
      <circle cx="65" cy="40" r="5" fill="white"/>
      <circle cx="65" cy="40" r="2" fill="black"/>
      <ellipse cx="50" cy="60" rx="15" ry="10" fill="white"/>
      <circle cx="50" cy="75" r="5" fill="white"/>
      <path d="M30 20 L40 30 M70 20 L60 30" stroke="black" stroke-width="2"/>
    </svg>`
  },
  {
    name: "Smiling Naruto",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#FFA500"/>
      <circle cx="35" cy="40" r="5" fill="black"/>
      <circle cx="65" cy="40" r="5" fill="black"/>
      <path d="M40 60 Q50 70 60 60" stroke="black" stroke-width="2" fill="none"/>
      <path d="M25 30 L35 30 M65 30 L75 30" stroke="black" stroke-width="2"/>
      <path d="M40 25 L45 35 L50 25 L55 35 L60 25" stroke="black" stroke-width="2" fill="none"/>
    </svg>`
  },
  {
    name: "Happy No Face",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#333"/>
      <circle cx="35" cy="40" r="3" fill="white"/>
      <circle cx="65" cy="40" r="3" fill="white"/>
      <path d="M40 60 Q50 70 60 60" stroke="white" stroke-width="2" fill="none"/>
    </svg>`
  },
  {
    name: "Cute Sailor Moon",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#FFD700"/>
      <circle cx="35" cy="40" r="5" fill="black"/>
      <circle cx="65" cy="40" r="5" fill="black"/>
      <path d="M40 60 Q50 70 60 60" stroke="black" stroke-width="2" fill="none"/>
      <path d="M50 10 L50 30" stroke="red" stroke-width="3"/>
      <circle cx="50" cy="10" r="5" fill="red"/>
      <path d="M30 20 Q50 35 70 20" stroke="red" stroke-width="2" fill="none"/>
    </svg>`
  }
];

const LoadingAnime = ({ text = "Loading...", size = 'md' }: LoadingAnimeProps) => {
  const [currentMascot, setCurrentMascot] = useState(0);
  
  useEffect(() => {
    // Change mascot every 1.5 seconds
    const interval = setInterval(() => {
      setCurrentMascot((prev) => (prev + 1) % mascots.length);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);
  
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-20 w-20',
    lg: 'h-32 w-32'
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div 
        className={`${sizeClasses[size]} relative animate-bounce`}
        dangerouslySetInnerHTML={{ __html: mascots[currentMascot].svg }}
      />
      <div className="flex items-center justify-center">
        <p className="text-lg font-medium mr-2">{text}</p>
        <Loader2 className="h-5 w-5 animate-spin text-[#ff3a3a]" />
      </div>
    </div>
  );
};

export default LoadingAnime;