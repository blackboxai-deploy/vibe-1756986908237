```tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Sale {
  id: string;
  product: string;
  quantity: number;
  total: number;
  date: string;
}

interface AlertItem {
  id: string;
  message: string;
  type: 'warning' | 'error';
}

export default function DealerPortal() {
  const { data: session, status } = useSession();
  const [stock, setStock] = useState<StockItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [orderQuantity, setOrderQuantity] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'dealer') {
      redirect('/auth/login');
    }
    fetchData();
  }, [session, status]);

  const fetchData = async () => {
    try {
      const [stockRes, salesRes, alertsRes] = await Promise.all([
        fetch('/api/dealer/stock'),
        fetch('/api/dealer/sales'),
        fetch('/api/dealer/alerts'),
      ]);
      setStock(await stockRes.json());
      setSales(await salesRes.json());
      setAlerts(await alertsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (productId: string) => {
    const quantity = orderQuantity[productId];
    if (!quantity || quantity <= 0) return;
    try {
      await fetch('/api/dealer/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      alert('Order placed successfully!');
      setOrderQuantity({ ...orderQuantity, [productId]: 0 });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dealer Portal - {session?.user?.name}</h1>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Alert key={alert.id} variant={alert.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Stock Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Order More</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={orderQuantity[item.id] || ''}
                      onChange={(e) => setOrderQuantity({ ...orderQuantity, [item.id]: parseInt(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleOrder(item.id)} size="sm">
                      Order
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sales History */}
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.product}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>₹{sale.total}</TableCell>
                  <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Status */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Outstanding: ₹0 (All settled)</p>
          <Badge variant="secondary">Up to Date</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
```