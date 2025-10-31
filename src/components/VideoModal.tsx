// components/VideoModal.tsx
import React, { useState } from 'react';
import { Video } from '../types/video';
import { X, Download, Heart, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface VideoModalProps {
  video: Video | null;
  relatedVideos: Video[];
  onClose: () => void;
  onVideoClick: (video: Video) => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ video, relatedVideos, onClose, onVideoClick }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  if (!video) return null;

  const handleDownload = async () => {
    if (!user) {
      alert('Please sign in to download videos');
      return;
    }
    
    const r2Url = video.video_url || video.url || (video as any).video_url;
    console.log('Downloading video URL:', r2Url);
    
    if (!r2Url) {
      console.error('Video object:', video);
      alert('Video URL is missing');
      return;
    }

    try { 
      await supabase.from('downloads').insert({ 
        user_id: user.id, 
        video_id: video.id 
      }); 
    } catch (err) {
      console.error('Failed to log download:', err);
    }

    const downloadUrl = `/api/dl?url=${encodeURIComponent(r2Url)}&t=${Date.now()}`;
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = (video.title || 'video') + '.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert('Please sign in to save favorites');
      return;
    }
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?video=${video.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Check out this video: ${video.title}`,
          url: shareUrl
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-gray-800 shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="relative aspect-video bg-black">
          <video 
            src={video.video_url || video.url} 
            poster={video.thumbnail_url || video.thumbnail}
            controls
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{video.title}</h2>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>{video.resolution || 'HD'}</span>
                <span>•</span>
                <span>{video.duration_seconds ? `${Math.floor(video.duration_seconds / 60)}:${String(video.duration_seconds % 60).padStart(2, '0')}` : '00:00'}</span>
                <span>•</span>
                <span className="capitalize">{video.category || 'General'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button 
              onClick={handleDownload} 
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Video
            </button>
            <button 
              onClick={toggleFavorite} 
              className={`px-6 py-3 ${isFavorite ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-800 hover:bg-gray-700'} text-white rounded-lg transition-colors flex items-center gap-2`}
            >
              <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={handleShare}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {video.tags?.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-800 text-cyan-400 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {relatedVideos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Related Videos</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedVideos.map((relVideo) => (
                  <div 
                    key={relVideo.id} 
                    onClick={() => onVideoClick(relVideo)} 
                    className="cursor-pointer group"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                      <img 
                        src={relVideo.thumbnail_url || relVideo.thumbnail} 
                        alt={relVideo.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center">
                          <span className="text-white text-xs">
                            {relVideo.duration_seconds ? `${Math.floor(relVideo.duration_seconds / 60)}:${String(relVideo.duration_seconds % 60).padStart(2, '0')}` : '00:00'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-1">{relVideo.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
