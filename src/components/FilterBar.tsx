import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedResolution: string;
  onResolutionChange: (resolution: string) => void;
}

const categories = ['All', 'Nature', 'Business', 'Abstract', 'Urban', 'People', 'Wildlife'];
const resolutions = ['All', 'HD', '4K'];

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedResolution,
  onResolutionChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search videos by title, tags, or mood..."
          className="w-full pl-12 pr-4 py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>
      
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 text-gray-400">
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-sm font-medium whitespace-nowrap">Filters:</span>
        </div>
        
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="h-6 w-px bg-gray-700" />
        
        <div className="flex gap-2">
          {resolutions.map((res) => (
            <button
              key={res}
              onClick={() => onResolutionChange(res)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedResolution === res
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
