```typescript
import { NextRequest, NextResponse } from 'next/server';
import { inventory, products, dealers } from '@/lib/db';
import { sendAlert } from '@/lib/utils'; // Assume this function sends email/console alert

// GET: Fetch inventory (all or by product/dealer)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const dealerId = searchParams.get('dealerId');

  let filteredInventory = inventory;
  if (productId) {
    filteredInventory = filteredInventory.filter(item => item.productId === productId);
  }
  if (dealerId) {
    filteredInventory = filteredInventory.filter(item => item.dealerId === dealerId);
  }

  // Check for low stock alerts
  filteredInventory.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (product && item.quantity < 10) { // Threshold: 10 units
      sendAlert(`Low stock alert: ${product.name} at ${item.location} (${item.quantity} left)`);
    }
  });

  return NextResponse.json(filteredInventory);
}

// POST: Update inventory (e.g., add/remove stock)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, dealerId, quantity, action } = body; // action: 'add' or 'remove'

  if (!productId || !dealerId || !quantity || !action) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const itemIndex = inventory.findIndex(item => item.productId === productId && item.dealerId === dealerId);
  if (itemIndex === -1) {
    return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
  }

  if (action === 'add') {
    inventory[itemIndex].quantity += quantity;
  } else if (action === 'remove') {
    if (inventory[itemIndex].quantity < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }
    inventory[itemIndex].quantity -= quantity;
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  // Trigger alert if low after update
  const product = products.find(p => p.id === productId);
  if (product && inventory[itemIndex].quantity < 10) {
    sendAlert(`Low stock alert: ${product.name} at ${inventory[itemIndex].location} (${inventory[itemIndex].quantity} left)`);
  }

  return NextResponse.json({ message: 'Inventory updated', item: inventory[itemIndex] });
}
```