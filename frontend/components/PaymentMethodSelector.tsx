import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type PaymentMethod = 'cash' | 'card';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
        <RadioGroup 
          value={value} 
          onValueChange={(val) => onChange(val as PaymentMethod)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="cursor-pointer">
              Cash on Delivery
              <p className="text-sm text-gray-500">Pay when you receive your order</p>
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="cursor-pointer">
              Credit/Debit Card
              <p className="text-sm text-gray-500">Pay securely with your card</p>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
} 