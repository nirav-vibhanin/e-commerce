import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { addToCart } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface AddToCartButtonProps {
  productId: string;
  stock: number;
  className?: string;
}

export function AddToCartButton({ productId, stock, className }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      await addToCart(productId, quantity);
      toast.success('Item added to cart');
      setQuantity(1);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 w-full ${className}`}>
      <div className="flex items-center rounded-md border border-input bg-white">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-lg font-medium"
          onClick={() => quantity > 1 && setQuantity(q => q - 1)}
          disabled={quantity <= 1 || loading}
        >
          -
        </Button>
        <Input
          type="number"
          min={1}
          max={stock}
          value={quantity}
          onChange={handleQuantityChange}
          className="h-9 w-16 border-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-lg font-medium"
          onClick={() => quantity < stock && setQuantity(q => q + 1)}
          disabled={quantity >= stock || loading}
        >
          +
        </Button>
      </div>
      <Button
        className="h-10 font-medium flex-1 min-w-[120px]"
        onClick={handleAddToCart}
        disabled={loading || stock === 0}
        variant={stock === 0 ? "destructive" : "default"}
      >
        {stock === 0 ? 'Out of Stock' : loading ? 'Adding...' : 'Add to Cart'}
      </Button>
    </div>
  );
} 