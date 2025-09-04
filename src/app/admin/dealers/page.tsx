```tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Dealer {
  id: string;
  name: string;
  area: string;
  stockLevels: number;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  overdueTrigger: boolean;
}

export default function DealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDealer, setEditingDealer] = useState<Dealer | null>(null);
  const [formData, setFormData] = useState({ name: '', area: '', stockLevels: 0, paymentStatus: 'Pending' as const });

  useEffect(() => {
    // Mock fetch from API
    const fetchDealers = async () => {
      const response = await fetch('/api/dealers');
      const data = await response.json();
      setDealers(data);
    };
    fetchDealers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingDealer ? 'PUT' : 'POST';
    const url = editingDealer ? `/api/dealers/${editingDealer.id}` : '/api/dealers';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setIsDialogOpen(false);
    setEditingDealer(null);
    setFormData({ name: '', area: '', stockLevels: 0, paymentStatus: 'Pending' });
    // Refresh data
    window.location.reload();
  };

  const handleEdit = (dealer: Dealer) => {
    setEditingDealer(dealer);
    setFormData({ name: dealer.name, area: dealer.area, stockLevels: dealer.stockLevels, paymentStatus: dealer.paymentStatus });
    setIsDialogOpen(true);
  };

  const handleFlagReassign = async (id: string) => {
    await fetch(`/api/dealers/${id}/reassign`, { method: 'POST' });
    // Refresh
    window.location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dealer Management</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setEditingDealer(null)}>Add Dealer</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDealer ? 'Edit Dealer' : 'Add Dealer'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="area">Area</Label>
              <Input id="area" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="stockLevels">Stock Levels</Label>
              <Input id="stockLevels" type="number" value={formData.stockLevels} onChange={(e) => setFormData({ ...formData, stockLevels: parseInt(e.target.value) })} required />
            </div>
            <div>
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select value={formData.paymentStatus} onValueChange={(value: 'Paid' | 'Pending' | 'Overdue') => setFormData({ ...formData, paymentStatus: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">{editingDealer ? 'Update' : 'Add'}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Area</TableHead>
            <TableHead>Stock Levels</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Overdue Trigger</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dealers.map((dealer) => (
            <TableRow key={dealer.id}>
              <TableCell>{dealer.id}</TableCell>
              <TableCell>{dealer.name}</TableCell>
              <TableCell>{dealer.area}</TableCell>
              <TableCell>{dealer.stockLevels}</TableCell>
              <TableCell>
                <Badge variant={dealer.paymentStatus === 'Paid' ? 'default' : dealer.paymentStatus === 'Pending' ? 'secondary' : 'destructive'}>
                  {dealer.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell>{dealer.overdueTrigger ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => handleEdit(dealer)}>Edit</Button>
                {dealer.overdueTrigger && (
                  <Button variant="destructive" onClick={() => handleFlagReassign(dealer.id)}>Reassign</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```