"use client";

import React from 'react';
import Link from 'next/link';
import { Home, Users, Boxes, ShoppingCart, LogOut, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  // Show nothing while checking authentication
  if (status === 'loading') {
    return null;
  }

  // Show nothing if not authenticated or not admin
  if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white p-4 z-30">
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <Link href="/admin-dashboard">
                  <span className="flex items-center p-2 rounded-md hover:bg-gray-700">
                    <Home className="mr-3 h-5 w-5" />
                    Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/admin-dashboard/orders">
                  <span className="flex items-center p-2 rounded-md hover:bg-gray-700">
                    <ShoppingCart className="mr-3 h-5 w-5" />
                    Orders
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/admin-dashboard/products">
                  <span className="flex items-center p-2 rounded-md hover:bg-gray-700">
                    <Boxes className="mr-3 h-5 w-5" />
                    Products
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/admin-dashboard/users">
                  <span className="flex items-center p-2 rounded-md hover:bg-gray-700">
                    <Users className="mr-3 h-5 w-5" />
                    Users
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/admin-dashboard/profile">
                  <span className="flex items-center p-2 rounded-md hover:bg-gray-700">
                    <User className="mr-3 h-5 w-5" />
                    Profile
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="mt-auto pt-4 border-t border-gray-700">
            <div className="px-2">
              <div className="mb-2 text-sm text-gray-400">
                Signed in as {session?.user?.email}
              </div>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>
      <main className="ml-64 p-8 bg-gray-100 min-h-screen">
        {children}
      </main>
    </>
  );
} 