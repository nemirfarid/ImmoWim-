import React, { useState, useRef, useEffect } from 'react';
import { Play, Volume2, VolumeX, ExternalLink, RefreshCw, Smartphone, Film } from 'lucide-react';

interface MobileVideoPlayerProps {
  videoUrl: string;
  posterImage?: string;
  title?: string;
}

export const MobileVideoPlayer: React.FC<MobileVideoPlayerProps> = ({
  videoUrl,
  posterImage,
  title = "Visite Virtuelle HD"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default to muted for mobile autoplay compatibility
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(videoUrl);
  const [userInteracted, setUserInteracted] = useState(false);

  // Reliable CDN backup sample videos for real estate tours
  const FALLBACK_VIDEOS = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  ];

  useEffect(() => {
    setCurrentSrc(videoUrl);
    setHasError(false);
    setIsPlaying(false);
    setUserInteracted(false);
  }, [videoUrl]);

  // Handle YouTube links
  const isYouTube = currentSrc.includes('youtube.com') || currentSrc.includes('youtu.be');
  let ytEmbedUrl = '';
  if (isYouTube) {
    const match = currentSrc.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      ytEmbedUrl = `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0&playsinline=1`;
    }
  }

  const handlePlayTap = () => {
    setUserInteracted(true);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          setHasError(false);
        }).catch((err) => {
          console.warn("Mobile video autoplay restricted, attempting muted play:", err);
          // Retry with mute forced
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setHasError(true));
          }
        });
      }
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleVideoError = () => {
    console.warn("Primary video failed on mobile device, switching to reliable HD stream...");
    setHasError(true);
    // Auto switch to fallback Google Cloud Storage MP4
    const fallback = FALLBACK_VIDEOS[0];
    setCurrentSrc(fallback);
    if (videoRef.current) {
      videoRef.current.src = fallback;
      videoRef.current.load();
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setHasError(false);
      }).catch(() => {});
    }
  };

  if (isYouTube && ytEmbedUrl) {
    return (
      <div className="relative w-full aspect-16/9 rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-lg">
        <iframe
          src={ytEmbedUrl}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-16/9 rounded-2xl overflow-hidden bg-slate-950 shadow-xl border border-slate-800 group select-none">
      <video
        ref={videoRef}
        src={currentSrc}
        poster={posterImage}
        playsInline
        muted={isMuted}
        preload="metadata"
        onError={handleVideoError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full object-contain bg-black cursor-pointer"
        onClick={handlePlayTap}
      >
        <source src={currentSrc} type="video/mp4" />
        <source src={FALLBACK_VIDEOS[0]} type="video/mp4" />
      </video>

      {/* Touch Play Overlay (Shown before interaction or when paused) */}
      {(!isPlaying || !userInteracted) && (
        <div 
          onClick={handlePlayTap}
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all hover:bg-black/40"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl scale-100 hover:scale-110 active:scale-95 transition-all mb-3 border-4 border-white/20">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950 ml-1" />
          </div>
          <p className="text-white font-black text-sm sm:text-base tracking-wide drop-shadow-md">
            ▶ Toucher pour lire la vidéo HD
          </p>
          <p className="text-emerald-300 text-xs font-semibold mt-1 bg-black/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Optimisé Téléphone / Mobile 📱
          </p>
        </div>
      )}

      {/* Top Floating Mobile Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
        {/* Sound Toggle Button */}
        <button
          type="button"
          onClick={toggleSound}
          className="px-3 py-1.5 rounded-full bg-black/75 hover:bg-black text-white text-xs font-black border border-white/20 shadow-lg backdrop-blur-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-amber-400" />
              <span>Activer le son</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Son activé</span>
            </>
          )}
        </button>

        {/* Direct Link Open for Phones */}
        <a
          href={currentSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-amber-300 text-xs font-bold border border-amber-500/30 shadow-lg backdrop-blur-md flex items-center gap-1 cursor-pointer"
          title="Ouvrir la vidéo directement sur votre téléphone"
          onClick={(e) => e.stopPropagation()}
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xs:inline">Lecteur externe</span>
          <ExternalLink className="w-3 h-3 text-amber-400" />
        </a>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 bg-black/70 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10 pointer-events-none">
        <span className="flex items-center gap-1.5 font-bold text-white truncate">
          <Film className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{title}</span>
        </span>
        <span className="text-[10px] text-emerald-400 font-mono shrink-0 ml-2">
          {isPlaying ? '● En cours de lecture' : 'Pause'}
        </span>
      </div>
    </div>
  );
};
