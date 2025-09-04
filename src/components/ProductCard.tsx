```tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import QRCode from 'react-qr-code';

interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
  image: string;
  color: string;
  quality: string;
  qrData: string; // JSON string or URL for QR
}

interface ProductCardProps {
  product: Product;
  onScan?: () => void; // Optional callback for scanning
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onScan }) => {
  const discountedPrice = product.price * (1 - product.discount / 100);

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{product.color}</Badge>
          <Badge variant="outline">{product.quality}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md"
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Original Price: ₹{product.price}</span>
          <span className="text-sm font-medium text-green-600">
            Discounted: ₹{discountedPrice.toFixed(2)} ({product.discount}% off)
          </span>
        </div>
        <div className="flex justify-center">
          <QRCode value={product.qrData} size={128} />
        </div>
        {onScan && (
          <Button onClick={onScan} className="w-full">
            Scan for Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
```