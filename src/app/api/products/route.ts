```typescript
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { Product } from '@/types';
import { products } from '@/lib/db';

export async function GET() {
  try {
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Omit<Product, 'id' | 'qrCode'> = await request.json();
    const newId = (products.length + 1).toString();
    const qrData = JSON.stringify({
      id: newId,
      name: body.name,
      price: body.price,
      discount: body.discount,
      color: body.color,
      quality: body.quality,
      imageUrl: body.imageUrl,
    });
    const qrCode = await QRCode.toDataURL(qrData);
    const newProduct: Product = {
      id: newId,
      ...body,
      qrCode,
      barcode: `BAR${newId}`, // Simple barcode generation
    };
    products.push(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
```