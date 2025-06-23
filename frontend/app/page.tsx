'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Welcome to E-Commerce
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl">
          Your one-stop shop for the best products. Discover amazing deals,
          track your orders, and manage your account with ease.
        </p>
      </div>
      <div className="mt-8 flex gap-4">
        <Link href="/login">
          <Button>Get Started</Button>
        </Link>
        <Link href="/products">
          <Button variant="secondary">Browse Products</Button>
        </Link>
      </div>
    </div>
  );
} 