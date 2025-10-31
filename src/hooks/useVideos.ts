// src/hooks/useVideos.ts
import { useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Video } from '../types/video';

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchVideos = useCallback(async (query = '', category = 'All', tag = '') => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    try {
      let q = supabase.from('videos').select('*').order('created_at', { ascending: false }).limit(54);
      if (category && category !== 'All') q = q.eq('category', category);
      if (tag) q = q.contains('tags', [tag]);
      if (query) q = q.ilike('title', `%${query}%`);

      const { data, error } = await q;
      if (error) throw error;
      if (ac.signal.aborted) return;

      const mapped: Video[] = (data || []).map(v => ({
        id: v.id,
        title: v.title,
        thumbnail: v.thumb,
        duration: `${v.duration}s`,
        resolution: v.resolution,
        tags: v.tags,
        category: v.category,
        fps: v.fps,
        url: v.url,
      }));
      setVideos(mapped);
    } finally {
      if (!abortRef.current?.signal.aborted) setLoading(false);
    }
  }, []);

  return { videos, loading, fetchVideos };
};
