'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Loader from '@/components/ui/loader';

const DashboardPage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold">
          Welcome to your Dashboard
        </h1>
        <p className="mt-3 text-lg">
          This is your protected dashboard area. Only logged-in users can see this.
        </p>
      </main>
    </div>
  );
};

export default DashboardPage; 