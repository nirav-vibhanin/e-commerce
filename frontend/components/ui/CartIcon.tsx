import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Badge } from './badge';
import { getCart } from '@/lib/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function CartIcon() {
  const [itemCount, setItemCount] = useState(0);
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      getCart()
        .then((data) => {
          setItemCount(data.items.length);
        })
        .catch((error) => {
          console.error('Failed to fetch cart:', error);
        });
    }
  }, [status]);

  return (
    <Link href="/cart" className="relative inline-flex items-center">
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <Badge
          variant="default"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
        >
          {itemCount}
        </Badge>
      )}
    </Link>
  );
} 