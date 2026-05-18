import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Terminal } from 'lucide-react';
import { musicPlaylist } from '../data/music';

interface MusicPlayerProps {
  onTrackChange?: (title: string) => void;
}

export function MusicPlayer({ onTrackChange }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = musicPlaylist[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.log('Audio play blocked:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Start with half volume
    }
    if (onTrackChange) onTrackChange(currentTrack.title);
  }, [currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % musicPlaylist.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? musicPlaylist.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="bg-black border-4 border-[#ff00ff] p-6 shadow-[8px_8px_0px_0px_#00ffff] flex flex-col sm:flex-row items-center gap-6 w-full max-w-2xl mx-auto animate-glitch" style={{ animationDuration: '4s' }}>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        className="hidden"
      />
      
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-[#00ffff] border-2 border-[#ff00ff] overflow-hidden">
        <img 
          src={currentTrack.cover} 
          alt="Album Cover" 
          className={`relative w-full h-full object-cover mix-blend-luminosity opacity-80 ${isPlaying ? 'animate-tear' : 'filter grayscale'}`}
        />
        <div className="absolute inset-0 bg-[#ff00ff] mix-blend-color opacity-50 pointer-events-none"></div>
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
             <Terminal className="w-10 h-10 text-[#00ffff] animate-pulse" />
          </div>
        )}
      </div>

      <div className="flex-1 w-full flex flex-col justify-center text-center sm:text-left">
        <h3 className="text-2xl sm:text-3xl font-bold text-[#00ffff] mb-1 line-clamp-1 glitch-text" data-text={currentTrack.title}>
          {currentTrack.title}
        </h3>
        <p className="text-[#ff00ff] text-xl font-medium mb-4 uppercase tracking-widest animate-pulse">
          &gt; {currentTrack.artist}
        </p>

        <div className="flex items-center justify-center sm:justify-start gap-4">
          <button 
            onClick={handlePrev}
            className="p-2 border-2 border-[#00ffff] bg-black text-[#00ffff] hover:bg-[#ff00ff] hover:text-black hover:border-[#ff00ff] transition-all transform hover:translate-x-1 hover:-translate-y-1 shadow-[4px_4px_0_0_#ff00ff] hover:shadow-none"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center border-2 border-[#ff00ff] bg-black text-[#ff00ff] hover:bg-[#00ffff] hover:text-black hover:border-[#00ffff] transition-all transform hover:translate-x-1 hover:-translate-y-1 shadow-[4px_4px_0_0_#00ffff] hover:shadow-none"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>
          
          <button 
            onClick={handleNext}
            className="p-2 border-2 border-[#00ffff] bg-black text-[#00ffff] hover:bg-[#ff00ff] hover:text-black hover:border-[#ff00ff] transition-all transform hover:translate-x-1 hover:-translate-y-1 shadow-[4px_4px_0_0_#ff00ff] hover:shadow-none"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>

          <div className="w-1 h-8 bg-[#ff00ff] mx-2 animate-pulse"></div>
          
          <button 
            onClick={toggleMute}
            className="p-2 text-[#00ffff] hover:text-[#ff00ff] transition-colors"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}
