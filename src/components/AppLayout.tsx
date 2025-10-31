// components/AppLayout.tsx
import React, { useState, useMemo, useEffect } from 'react';
import Hero from './Hero';
import FilterBar from './FilterBar';
import VideoCard from './VideoCard';
import VideoModal from './VideoModal';
import PricingCard from './PricingCard';
import Footer from './Footer';
import { useVideos } from '../hooks/useVideos';
import { Video } from '../types/video';

const AppLayout: React.FC = () => {
  const { videos, loading, fetchVideos } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedResolution, setSelectedResolution] = useState('All');
  const heroRef = React.useRef<HTMLDivElement>(null);
  const browseRef = React.useRef<HTMLDivElement>(null);
  const pricingRef = React.useRef<HTMLDivElement>(null);

  // حارس لمنع التكرار في وضع التطوير مع StrictMode
  const didInit = React.useRef(false);

  // Debounced fetch on search/category
  useEffect(() => {
    if (import.meta.env.DEV) {
      if (didInit.current) return;
      didInit.current = true;
    }
    const t = setTimeout(() => {
      fetchVideos(searchQuery, selectedCategory);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, selectedCategory, fetchVideos]);

  const filteredVideos = useMemo(() => {
    return videos.filter(v => selectedResolution === 'All' || v.resolution === selectedResolution);
  }, [videos, selectedResolution]);

  const relatedVideos = useMemo(() => {
    if (!selectedVideo) return [];
    return videos.filter(v => v.category === selectedVideo.category && v.id !== selectedVideo.id).slice(0, 4);
  }, [selectedVideo, videos]);

  const scrollToBrowse = () => browseRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToPricing = () => pricingRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div ref={heroRef}>
        <Hero onSearchClick={scrollToBrowse} onGetStarted={scrollToPricing} />
      </div>

      <div ref={browseRef} className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Explore Our <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI Library</span>
          </h2>
          <p className="text-xl text-gray-400">Browse high-quality AI-generated videos</p>
        </div>

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedResolution={selectedResolution}
          onResolutionChange={setSelectedResolution}
        />

        {/* الحالة بدون وميض */}
        <div className="mt-8 mb-4 text-gray-400">
          {loading && videos.length === 0 ? 'Loading...' : `Showing ${filteredVideos.length} videos`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map(video => (
            <VideoCard key={video.id} video={video} onClick={() => setSelectedVideo(video)} />
          ))}
        </div>

        {!loading && filteredVideos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No videos found. Try adjusting your filters.</p>
          </div>
        )}
      </div>

      <div ref={pricingRef} className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Simple, Transparent <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-xl text-gray-400">Choose the plan that fits your creative needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard
            name="Starter" price="15" period="month"
            features={['50 downloads/month', 'HD & 4K', 'Commercial license', 'Basic support', 'Cancel anytime']}
            onSubscribe={() => alert('Checkout...')}
          />
          <PricingCard
            name="Pro" price="29" period="month" highlighted
            features={['Unlimited downloads', 'HD & 4K', 'Extended license', 'Priority support', 'Early access', 'API access']}
            onSubscribe={() => alert('Checkout...')}
          />
          <PricingCard
            name="Team" price="79" period="month"
            features={['Everything in Pro', '10 team members', 'Team dashboard', 'Account manager', 'Custom licensing', 'Volume discounts']}
            onSubscribe={() => alert('Checkout...')}
          />
        </div>
      </div>

      <Footer />

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          relatedVideos={relatedVideos}
          onClose={() => setSelectedVideo(null)}
          onVideoClick={setSelectedVideo}
        />
      )}
    </div>
  );
};

export default AppLayout;
