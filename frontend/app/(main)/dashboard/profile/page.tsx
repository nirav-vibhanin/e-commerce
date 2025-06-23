'use client';

import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import { UpdateProfileForm } from '@/components/auth/UpdateProfileForm';
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';

const ProfilePage = () => {
  const { status } = useSession();

  if (status === 'loading') {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-6 pt-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    );
  }

  if (status === 'unauthenticated') {
    return <p>You must be logged in to view this page.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      
      <UpdateProfileForm />
      <ChangePasswordForm />

    </div>
  );
};

export default ProfilePage; 