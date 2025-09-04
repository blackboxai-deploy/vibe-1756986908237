```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Sale, Customer } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { salespersonId, productId, customerId, discount, geolocation } = body;

    // Validate required fields
    if (!salespersonId || !productId || !customerId || !geolocation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find product and customer
    const product = db.products.find(p => p.id === productId);
    const customer = db.customers.find(c => c.id === customerId);

    if (!product || !customer) {
      return NextResponse.json({ error: 'Product or customer not found' }, { status: 404 });
    }

    // Calculate discounted price
    const discountedPrice = product.price * (1 - discount / 100);

    // Create sale record
    const sale: Sale = {
      id: Date.now().toString(),
      salespersonId,
      productId,
      customerId,
      discount,
      price: discountedPrice,
      timestamp: new Date().toISOString(),
      geolocation,
    };

    // Save to db
    db.sales.push(sale);

    // Update inventory (reduce stock)
    const inventoryItem = db.inventory.find(i => i.productId === productId);
    if (inventoryItem) {
      inventoryItem.quantity -= 1;
    }

    // Simulate SMS to customer
    simulateSMS(customer.mobile, `Thank you for your purchase! Product: ${product.name}, Discounted Price: ₹${discountedPrice}`);

    return NextResponse.json({ message: 'Sale recorded successfully', sale }, { status: 201 });
  } catch (error) {
    console.error('Error processing sale:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Return all sales for reports
    return NextResponse.json({ sales: db.sales });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Mock SMS function (replace with real SMS API in production)
function simulateSMS(mobile: string, message: string) {
  console.log(`SMS sent to ${mobile}: ${message}`);
  // In production: Integrate with SMS service like Twilio
}
```