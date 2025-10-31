import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Subscription {
  plan: string;
  status: string;
  current_period_end: string;
}

export default function SubscriptionStats({ userId }: { userId: string }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [downloadCount, setDownloadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan, status, current_period_end')
      .eq('user_id', userId)
      .single();

    const { count } = await supabase
      .from('downloads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (sub) setSubscription(sub);
    if (count !== null) setDownloadCount(count);
    setLoading(false);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  const planLimits: Record<string, number> = { free: 10, pro: 100, enterprise: 1000 };
  const limit = planLimits[subscription?.plan || 'free'];
  const percentage = (downloadCount / limit) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current Plan</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold capitalize">{subscription?.plan || 'Free'}</span>
            <Badge variant={subscription?.status === 'active' ? 'default' : 'secondary'}>
              {subscription?.status || 'inactive'}
            </Badge>
          </div>
          {subscription?.current_period_end && (
            <p className="text-sm text-gray-500">
              Renews: {format(new Date(subscription.current_period_end), 'MMM dd, yyyy')}
            </p>
          )}
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Usage</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Downloads</span>
            <span>{downloadCount} / {limit}</span>
          </div>
          <Progress value={percentage} />
        </div>
      </Card>
    </div>
  );
}
