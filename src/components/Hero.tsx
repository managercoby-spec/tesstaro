import React, { useState } from 'react';
import { Search, Sparkles, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';


interface HeroProps {
  onSearchClick: () => void;
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSearchClick, onGetStarted }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);


  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/68fa7ae8a78d153312492802_1761245987473_5570c75a.webp"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-950" />
      </div>

      <div className="absolute top-6 right-6 z-20">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-white text-sm">{user.email}</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg flex items-center gap-2 border border-white/20"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg flex items-center gap-2 border border-white/20"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg flex items-center gap-2 border border-white/20"
          >
            <User className="w-4 h-4" />
            Sign In
          </button>
        )}
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4" />
          <span>100% AI-Generated Stock Videos</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Discover Unlimited
          <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AI Stock Videos
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          High-quality, royalty-free footage for creators, made entirely by artificial intelligence. 
          Subscribe for $15/month. Download instantly. Own your creative freedom.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button 
            onClick={onGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
          >
            Get Started — $15/month
          </button>
          <button 
            onClick={onSearchClick}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl transition-all border border-white/20 hover:border-white/40"
          >
            Browse Library
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-4xl font-bold text-white mb-2">100K+</div>
            <div className="text-gray-400 text-sm">AI Videos</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">4K</div>
            <div className="text-gray-400 text-sm">Resolution</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-gray-400 text-sm">Royalty-Free</div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Hero;
