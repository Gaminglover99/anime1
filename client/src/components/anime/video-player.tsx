import { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  SkipBack, SkipForward, Settings, Download, Youtube
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { VideoSource } from '@shared/schema';

interface VideoPlayerProps {
  sources: VideoSource[];
  title: string;
  episodeNumber: number;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  hasNextEpisode?: boolean;
  hasPrevEpisode?: boolean;
  onComplete?: () => void;
}

const VideoPlayer = ({
  sources,
  title,
  episodeNumber,
  onNextEpisode,
  onPrevEpisode,
  hasNextEpisode = false,
  hasPrevEpisode = false,
  onComplete,
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState<string>('');
  const [controlsTimeout, setControlsTimeout] = useState<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  // Sort sources by quality (highest to lowest) and select the default quality
  const sortedSources = [...sources].sort((a, b) => {
    const qualityA = parseInt(a.quality.replace('p', ''));
    const qualityB = parseInt(b.quality.replace('p', ''));
    return qualityB - qualityA;
  });
  
  // Set default quality to the highest available
  useEffect(() => {
    if (sortedSources.length > 0 && !selectedQuality) {
      setSelectedQuality(sortedSources[0].quality);
    }
  }, [sortedSources, selectedQuality]);
  
  // Get the selected source URL and check if it's YouTube or other external source
  const selectedSource = sortedSources.find(source => source.quality === selectedQuality);
  const sourceUrl = selectedSource?.url || '';
  
  // Check if the source is a YouTube video
  const isYouTubeVideo = sourceUrl.includes('youtube.com') || sourceUrl.includes('youtu.be');
  
  // Extract YouTube video ID if it's a YouTube URL
  const getYoutubeVideoId = (url: string) => {
    if (!url) return '';
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i;
    const match = url.match(youtubeRegex);
    return match ? match[1] : '';
  };
  
  const youtubeVideoId = getYoutubeVideoId(sourceUrl);
  
  // Update video source when quality changes (only for regular video sources)
  useEffect(() => {
    if (!isYouTubeVideo && videoRef.current && sourceUrl) {
      const currentTime = videoRef.current.currentTime;
      videoRef.current.src = sourceUrl;
      videoRef.current.currentTime = currentTime;
      
      if (isPlaying) {
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
        });
      }
    }
  }, [sourceUrl, isPlaying, isYouTubeVideo]);
  
  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };
  
  // Handle mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 1;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  };
  
  // Update progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Check if video is complete (within 1 second of the end)
      if (videoRef.current.currentTime >= videoRef.current.duration - 1 && onComplete) {
        onComplete();
      }
    }
  };
  
  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  // Format time in MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Handle seeking
  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    setCurrentTime(seekTime);
    
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };
  
  // Handle seeking with progress bar click
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const seekTime = pos * duration;
    
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };
  
  // Handle quality change
  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
  };
  
  // Handle mouse movement to show/hide controls
  const handleMouseMove = () => {
    setIsControlsVisible(true);
    
    // Clear existing timeout
    if (controlsTimeout) {
      window.clearTimeout(controlsTimeout);
    }
    
    // Set new timeout to hide controls after 3 seconds
    const timeout = window.setTimeout(() => {
      setIsControlsVisible(false);
    }, 3000);
    
    setControlsTimeout(timeout);
  };
  
  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        window.clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          togglePlay();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
        case 'arrowright':
          if (videoRef.current) {
            videoRef.current.currentTime += 10;
          }
          break;
        case 'arrowleft':
          if (videoRef.current) {
            videoRef.current.currentTime -= 10;
          }
          break;
        case 'n':
          if (hasNextEpisode && onNextEpisode) {
            onNextEpisode();
          }
          break;
        case 'p':
          if (hasPrevEpisode && onPrevEpisode) {
            onPrevEpisode();
          }
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [togglePlay, toggleFullscreen, toggleMute, hasNextEpisode, hasPrevEpisode, onNextEpisode, onPrevEpisode]);
  
  return (
    <div 
      ref={playerRef}
      className="relative w-full aspect-video bg-black rounded-none overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {isYouTubeVideo ? (
        // YouTube iframe for YouTube videos
        <div className="w-full h-full">
          <iframe 
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&enablejsapi=1&modestbranding=1&rel=0&showinfo=0`}
            title={`${title} - Episode ${episodeNumber}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        // Standard video element for regular sources
        <video
          ref={videoRef}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          autoPlay
          playsInline
          src={sourceUrl}
        >
          Your browser does not support the video tag.
        </video>
      )}
      
      {/* Play/Pause overlay - only for regular videos */}
      {!isYouTubeVideo && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <button 
            onClick={togglePlay}
            className="w-20 h-20 bg-[#ff3a3a]/90 hover:bg-[#ff3a3a] rounded-full flex items-center justify-center"
          >
            <Play className="w-10 h-10 text-white ml-1" fill="white" />
          </button>
        </div>
      )}
      
      {/* Controls - only for regular videos */}
      {!isYouTubeVideo && (
        <div className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Progress bar */}
          <div 
            ref={progressBarRef}
            className="h-1 w-full bg-gray-700 cursor-pointer hover:h-2 transition-all"
            onClick={handleProgressBarClick}
          >
            <div 
              className="h-full bg-[#ff3a3a]"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          
          <div className="p-2 flex items-center justify-between bg-black/50">
            {/* Left controls: play/pause and time */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={togglePlay}
                className="p-1 rounded-full hover:bg-white/10"
              >
                {isPlaying ? 
                  <Pause className="w-6 h-6 text-white" /> : 
                  <Play className="w-6 h-6 text-white" />
                }
              </button>
              
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            {/* Middle controls: prev/next episode */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
              {hasPrevEpisode && (
                <button 
                  onClick={onPrevEpisode}
                  className="p-1 rounded-full hover:bg-white/10"
                >
                  <SkipBack className="w-5 h-5 text-white" />
                </button>
              )}
              
              {hasNextEpisode && (
                <button 
                  onClick={onNextEpisode}
                  className="p-1 rounded-full hover:bg-white/10"
                >
                  <SkipForward className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
            
            {/* Right controls: volume, download, fullscreen */}
            <div className="flex items-center space-x-3">
              {/* Volume control */}
              <div className="flex items-center space-x-2 group">
                <button 
                  onClick={toggleMute}
                  className="p-1 rounded-full hover:bg-white/10"
                >
                  {isMuted ? 
                    <VolumeX className="w-5 h-5 text-white" /> : 
                    <Volume2 className="w-5 h-5 text-white" />
                  }
                </button>
                
                <div className="w-16 hidden group-hover:block">
                  <Slider 
                    value={[isMuted ? 0 : volume]} 
                    max={1} 
                    step={0.01} 
                    onValueChange={handleVolumeChange} 
                    className="h-1"
                  />
                </div>
              </div>
              
              {/* Download button */}
              <a
                href={sourceUrl}
                download={`${title} - Episode ${episodeNumber}.mp4`}
                className="p-1 rounded-full hover:bg-white/10 inline-flex"
              >
                <Download className="w-5 h-5 text-white" />
              </a>
              
              {/* Fullscreen toggle */}
              <button 
                onClick={toggleFullscreen}
                className="p-1 rounded-full hover:bg-white/10"
              >
                {isFullscreen ? 
                  <Minimize className="w-5 h-5 text-white" /> : 
                  <Maximize className="w-5 h-5 text-white" />
                }
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Episode navigation for YouTube videos */}
      {isYouTubeVideo && (hasNextEpisode || hasPrevEpisode) && (
        <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-4 p-2 bg-black/50">
          {hasPrevEpisode && (
            <button 
              onClick={onPrevEpisode}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center space-x-2"
            >
              <SkipBack className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Previous Episode</span>
            </button>
          )}
          
          {hasNextEpisode && (
            <button 
              onClick={onNextEpisode}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center space-x-2"
            >
              <span className="text-white text-sm">Next Episode</span>
              <SkipForward className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;