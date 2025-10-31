import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

interface Download {
  id: string;
  created_at: string;
  video: {
    id: string;
    title: string;
    thumb: string;
    duration: number;
  };
}

export default function DownloadHistory({ userId }: { userId: string }) {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloads();
  }, [userId]);

  const fetchDownloads = async () => {
    const { data, error } = await supabase
      .from('downloads')
      .select('id, created_at, video:videos(id, title, thumb, duration)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setDownloads(data as any);
    }
    setLoading(false);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      {downloads.map((download) => (
        <Card key={download.id} className="p-4 flex gap-4 hover:shadow-lg transition">
          <img src={download.video.thumb} alt={download.video.title} className="w-32 h-20 object-cover rounded" />
          <div className="flex-1">
            <h3 className="font-semibold">{download.video.title}</h3>
            <p className="text-sm text-gray-500">{format(new Date(download.created_at), 'MMM dd, yyyy HH:mm')}</p>
          </div>
        </Card>
      ))}
      {downloads.length === 0 && <p className="text-center text-gray-500">No downloads yet</p>}
    </div>
  );
}
