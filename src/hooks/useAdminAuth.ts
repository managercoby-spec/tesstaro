 // src/hooks/useAdminAuth.ts
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export function useAdminAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error || data?.role !== 'admin') {
          alert('Access denied. Admins only!');
          navigate('/');
          return;
        }

        setIsAdmin(true);
      } catch (err) {
        console.error('Admin check failed:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [user, navigate]);

  return { isAdmin, loading };
}
