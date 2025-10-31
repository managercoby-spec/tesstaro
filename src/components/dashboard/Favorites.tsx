import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Video {
  id: string;
  title: string;
  thumb: string;
  duration: number;
  category: string;
}

export default function Favorites({ userId }: { userId: string }) {
  const [favorites, setFavorites] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  const fetchFavorites = async () => {
    const favs = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
    if (favs.length > 0) {
      const { data } = await supabase
        .from('videos')
        .select('id, title, thumb, duration, category')
        .in('id', favs);
      if (data) setFavorites(data);
    }
    setLoading(false);
  };

  const removeFavorite = (videoId: string) => {
    const favs = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
    const updated = favs.filter((id: string) => id !== videoId);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(updated));
    setFavorites(favorites.filter(v => v.id !== videoId));
    toast({ title: 'Removed from favorites' });
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((video) => (
        <Card key={video.id} className="overflow-hidden hover:shadow-lg transition">
          <img src={video.thumb} alt={video.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="font-semibold mb-2">{video.title}</h3>
            <Button variant="outline" size="sm" onClick={() => removeFavorite(video.id)} className="w-full">
              <Heart className="w-4 h-4 mr-2 fill-red-500 text-red-500" />
              Remove
            </Button>
          </div>
        </Card>
      ))}
      {favorites.length === 0 && <p className="col-span-full text-center text-gray-500">No favorites yet</p>}
    </div>
  );
}
