'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Loader from '@/components/ui/loader';

const DashboardPage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Loader />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {session?.user?.name}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your dashboard. You can manage your orders, profile, and more from here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage; 