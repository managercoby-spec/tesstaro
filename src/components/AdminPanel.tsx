import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Upload, X } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    category: 'Nature',
    behavior: '',
    env: '',
    time_of_day: '',
    shot: '',
    duration: 10,
    resolution: '4K',
    fps: 30,
    url: '',
    thumb: ''
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    try {
      const { error } = await supabase.from('videos').insert({
        title: formData.title,
        tags: formData.tags.split(',').map(t => t.trim()),
        category: formData.category,
        behavior: formData.behavior,
        env: formData.env,
        time_of_day: formData.time_of_day,
        shot: formData.shot,
        duration: formData.duration,
        resolution: formData.resolution,
        fps: formData.fps,
        url: formData.url,
        thumb: formData.thumb
      });

      if (error) throw error;

      setMessage('Video uploaded successfully!');
      setFormData({
        title: '',
        tags: '',
        category: 'Nature',
        behavior: '',
        env: '',
        time_of_day: '',
        shot: '',
        duration: 10,
        resolution: '4K',
        fps: 30,
        url: '',
        thumb: ''
      });
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-20">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="bg-gray-900/50 border-gray-800 p-8">
          <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <Upload className="w-10 h-10 text-cyan-400" />
            Admin Panel - Upload Video
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-white font-medium mb-2 block">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter video title"
              />
            </div>

            <div>
              <label className="text-white font-medium mb-2 block">Tags (comma-separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                required
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="nature, forest, peaceful"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white font-medium mb-2 block">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-md p-2"
                >
                  <option>Nature</option>
                  <option>Business</option>
                  <option>Abstract</option>
                  <option>Urban</option>
                  <option>People</option>
                  <option>Wildlife</option>
                </select>
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Resolution</label>
                <select
                  value={formData.resolution}
                  onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-md p-2"
                >
                  <option>4K</option>
                  <option>HD</option>
                  <option>FHD</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white font-medium mb-2 block">Duration (seconds)</label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">FPS</label>
                <Input
                  type="number"
                  value={formData.fps}
                  onChange={(e) => setFormData({ ...formData, fps: parseInt(e.target.value) })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-white font-medium mb-2 block">Video URL</label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="text-white font-medium mb-2 block">Thumbnail URL</label>
              <Input
                value={formData.thumb}
                onChange={(e) => setFormData({ ...formData, thumb: e.target.value })}
                required
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="https://..."
              />
            </div>

            <Button
              type="submit"
              disabled={uploading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3"
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </Button>

            {message && (
              <div className={`p-4 rounded ${message.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {message}
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
