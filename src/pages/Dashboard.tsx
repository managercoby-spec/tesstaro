import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Heart, CreditCard, Settings, ArrowLeft } from 'lucide-react';
import DownloadHistory from '@/components/dashboard/DownloadHistory';
import Favorites from '@/components/dashboard/Favorites';
import SubscriptionStats from '@/components/dashboard/SubscriptionStats';
import AccountSettings from '@/components/dashboard/AccountSettings';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const exportToCSV = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('downloads')
      .select('created_at, video:videos(title, category, duration, resolution)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!data || data.length === 0) {
      toast({ title: 'No data', description: 'No downloads to export' });
      return;
    }

    const csv = [
      ['Date', 'Video Title', 'Category', 'Duration', 'Resolution'],
      ...data.map((d: any) => [
        new Date(d.created_at).toLocaleString(),
        d.video.title,
        d.video.category,
        `${d.video.duration}s`,
        d.video.resolution
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `download-history-${Date.now()}.csv`;
    a.click();
    toast({ title: 'Success', description: 'Download history exported' });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
            <h1 className="text-4xl font-bold">My Dashboard</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <Button onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stats"><CreditCard className="w-4 h-4 mr-2" /> Subscription</TabsTrigger>
            <TabsTrigger value="downloads"><Download className="w-4 h-4 mr-2" /> Downloads</TabsTrigger>
            <TabsTrigger value="favorites"><Heart className="w-4 h-4 mr-2" /> Favorites</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-2" /> Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="stats"><SubscriptionStats userId={user.id} /></TabsContent>
          <TabsContent value="downloads"><DownloadHistory userId={user.id} /></TabsContent>
          <TabsContent value="favorites"><Favorites userId={user.id} /></TabsContent>
          <TabsContent value="settings"><AccountSettings email={user.email || ''} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
