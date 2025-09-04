import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AlertModal from '@/components/AlertModal';
import Map from '@/components/Map';

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Vastratrota</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">₹15,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Dealers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-600">3 Products</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <AlertModal />
        <Map />
      </div>
    </div>
  );
}