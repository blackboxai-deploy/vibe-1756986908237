```tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DashboardData {
  todayCollection: number;
  monthlyCollection: number;
  yearlyCollection: number;
  discountsRemaining: number;
  discountsUsed: number;
  stockInHand: number;
  stockSent: number;
  recentSales: Array<{
    id: string;
    product: string;
    amount: number;
    discount: number;
    date: string;
  }>;
}

export default function SalespersonDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('/api/salesperson/dashboard');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!data) {
    return <div className="flex justify-center items-center h-screen">Error loading data</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Salesperson Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Today's Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">₹{data.todayCollection}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">₹{data.monthlyCollection}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Yearly Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">₹{data.yearlyCollection}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Discounts Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{data.discountsRemaining}%</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Discounts Used</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{data.discountsUsed}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Stock in Hand</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{data.stockInHand} units</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Stock Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{data.stockSent} units</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.product}</TableCell>
                  <TableCell>₹{sale.amount}</TableCell>
                  <TableCell>{sale.discount}%</TableCell>
                  <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button onClick={() => window.location.href = '/salesperson/scan'}>Start Scanning</Button>
      </div>
    </div>
  );
}
```