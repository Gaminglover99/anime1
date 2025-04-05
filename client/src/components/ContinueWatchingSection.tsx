import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface Episode {
  id: number;
  number: number;
  title: string;
  duration: number;
  thumbUrl: string;
  season: number;
}

interface Anime {
  id: number;
  title: string;
}

interface Progress {
  watchedSeconds: number;
  completed: boolean;
}

interface ContinueWatchingItem {
  episode: Episode;
  anime: Anime;
  progress: Progress;
}

const ContinueWatchingSection = () => {
  // Normally we would get the userId from authentication context
  const userId = 1; // Mock user ID
  
  const { data: continueWatchingItems, isLoading } = useQuery<ContinueWatchingItem[]>({
    queryKey: [`/api/user/${userId}/continue-watching`],
  });

  // Calculate remaining time based on progress and duration
  const getRemainingTime = (duration: number, watchedSeconds: number) => {
    const totalSeconds = duration * 60;
    const remainingSeconds = totalSeconds - watchedSeconds;
    
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = Math.floor(remainingSeconds % 60);
    
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  // Calculate percentage complete
  const getPercentComplete = (duration: number, watchedSeconds: number) => {
    const totalSeconds = duration * 60;
    return Math.round((watchedSeconds / totalSeconds) * 100);
  };

  return (
    <section className="py-8 container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-poppins">Continue Watching</h2>
        <Link href="/watchlist">
          <a className="text-[#6C5CE7] hover:text-[#6C5CE7]/80 font-medium flex items-center">
            View All <i className="fas fa-chevron-right ml-2 text-xs"></i>
          </a>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex space-x-4 overflow-x-auto custom-scrollbar pb-4 -mx-4 px-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse" style={{ width: '240px' }}>
              <div className="aspect-video rounded-lg bg-[#2D2D2D]"></div>
              <div className="h-4 bg-[#2D2D2D] rounded mt-2 w-2/3"></div>
              <div className="h-3 bg-[#2D2D2D] rounded mt-1 w-1/2"></div>
            </div>
          ))}
        </div>
      ) : continueWatchingItems && continueWatchingItems.length > 0 ? (
        <div className="overflow-x-auto custom-scrollbar pb-4 -mx-4 px-4">
          <div className="flex space-x-4" style={{ minWidth: 'max-content' }}>
            {continueWatchingItems.map(item => {
              const percentComplete = getPercentComplete(
                item.episode.duration, 
                item.progress.watchedSeconds
              );
              
              const timeLeft = getRemainingTime(
                item.episode.duration, 
                item.progress.watchedSeconds
              );
              
              return (
                <div 
                  key={item.episode.id} 
                  className="relative group cursor-pointer" 
                  style={{ width: '240px' }}
                >
                  <div className="aspect-video rounded-lg overflow-hidden bg-[#2D2D2D] relative">
                    <img 
                      src={item.episode.thumbUrl} 
                      alt={`${item.anime.title} episode ${item.episode.number}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-60"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-12 h-12 rounded-full bg-[#6C5CE7]/90 flex items-center justify-center">
                        <i className="fas fa-play text-white"></i>
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="w-full bg-[#2D2D2D]/50 rounded-full h-1.5 mb-1">
                        <div 
                          className="bg-[#6C5CE7] h-full rounded-full" 
                          style={{ width: `${percentComplete}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>{percentComplete}% complete</span>
                        <span>{timeLeft} left</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm mt-2">{item.anime.title}</h3>
                  <p className="text-xs text-[#BBBBBB]">
                    S{item.episode.season}:E{item.episode.number} - {item.episode.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-[#1E1E1E] rounded-lg p-6 text-center">
          <p className="text-[#BBBBBB]">You haven't started watching any anime yet.</p>
          <Link href="/anime">
            <a className="text-[#6C5CE7] mt-2 inline-block hover:underline">
              Discover anime to watch
            </a>
          </Link>
        </div>
      )}
    </section>
  );
};

export default ContinueWatchingSection;
