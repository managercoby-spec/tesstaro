import React from 'react';
import { Video } from '../types/video';
import { Play, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const { user } = useAuth(); // ✅ إضافة useAuth

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // ✅ شرط Authentication
    if (!user) {
      alert('Please sign in to download videos');
      return;
    }
    
    // ✅ التأكد من وجود الرابط
    const r2Url = video.video_url || video.url || (video as any).video_url;
    console.log('VideoCard download URL:', r2Url); // للتشخيص
    
    if (!r2Url) {
      console.error('Video object:', video);
      alert('Video URL is missing');
      return;
    }
    
    const downloadHref = `/api/dl?url=${encodeURIComponent(r2Url)}&t=${Date.now()}`;
    
    const link = document.createElement('a');
    link.href = downloadHref;
    link.download = video.title + '.mp4';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      onClick={onClick}
      className="group relative cursor-pointer rounded-lg overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={video.thumbnail_url || video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-cyan-500/90 flex items-center justify-center backdrop-blur-sm">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white font-medium">
          {video.duration || '00:10'}
        </div>
        <div className="absolute top-2 left-2 px-2 py-1 bg-cyan-500/90 backdrop-blur-sm rounded text-xs text-white font-bold">
          {video.resolution || '1080p'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-1">{video.title}</h3>
        <div className="flex flex-wrap gap-1 mb-3">
          {video.tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-xs px-2 py-1 bg-gray-800/80 text-gray-300 rounded">
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors bg-transparent border-0 cursor-pointer p-0"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
};

export default VideoCard;