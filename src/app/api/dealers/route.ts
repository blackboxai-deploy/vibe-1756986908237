```typescript
import { NextRequest, NextResponse } from 'next/server';
import { dealers, products } from '@/lib/db'; // In-memory storage
import { Dealer } from '@/types'; // Assuming types are defined

// GET: Fetch all dealers or by ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const dealer = dealers.find((d) => d.id === id);
    if (!dealer) {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
    }
    return NextResponse.json(dealer);
  }

  // Check for overdue dealers (e.g., no order in 7 days)
  const now = new Date();
  const overdueDealers = dealers.filter((d) => {
    const daysSinceLastOrder = (now.getTime() - new Date(d.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLastOrder > 7 && d.stockLevels.some((level) => level > 0); // Assuming stockLevels is array of numbers
  });

  // Simulate alert (in real app, send email/notification)
  if (overdueDealers.length > 0) {
    console.log('Overdue dealers:', overdueDealers.map(d => d.name));
  }

  return NextResponse.json(dealers);
}

// POST: Create new dealer
export async function POST(request: NextRequest) {
  const body: Omit<Dealer, 'id'> = await request.json();
  const newDealer: Dealer = {
    id: Date.now().toString(), // Simple ID generation
    ...body,
    lastOrderDate: new Date(),
  };
  dealers.push(newDealer);
  return NextResponse.json(newDealer, { status: 201 });
}

// PUT: Update dealer (e.g., stock, payment)
export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const updates: Partial<Dealer> = await request.json();
  const dealerIndex = dealers.findIndex((d) => d.id === id);
  if (dealerIndex === -1) {
    return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
  }

  dealers[dealerIndex] = { ...dealers[dealerIndex], ...updates };
  return NextResponse.json(dealers[dealerIndex]);
}

// DELETE: Remove dealer
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const dealerIndex = dealers.findIndex((d) => d.id === id);
  if (dealerIndex === -1) {
    return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
  }

  dealers.splice(dealerIndex, 1);
  return NextResponse.json({ message: 'Dealer deleted' });
}
```