import React from 'react';
import { Video, Twitter, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Staro.io</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              The world's first full-scale AI stock video platform. Instant downloads, cinematic quality, 100% royalty-free.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-cyan-500 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-cyan-500 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-cyan-500 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-cyan-500 rounded-lg flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Browse Library</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">API Access</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Enterprise</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">License Agreement</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 Staro.io. All rights reserved.</p>
          <p className="text-gray-500 text-sm">Made with AI • Powered by Innovation</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
