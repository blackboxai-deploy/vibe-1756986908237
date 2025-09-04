```tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Scanner } from '@/components/Scanner'
import { useGeolocation } from '@/hooks/useGeolocation'
import { Product, Customer } from '@/types'

export default function ScanPage() {
  const [scannedData, setScannedData] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [customer, setCustomer] = useState<Customer>({ name: '', mobile: '', location: '' })
  const [discount, setDiscount] = useState<number>(0)
  const { location, error: locationError } = useGeolocation()

  useEffect(() => {
    if (scannedData) {
      // Simulate fetching product from API based on scanned QR
      fetch('/api/products?qr=' + scannedData)
        .then(res => res.json())
        .then(data => setProduct(data))
        .catch(err => console.error('Error fetching product:', err))
    }
  }, [scannedData])

  const handleScan = (data: string) => {
    setScannedData(data)
  }

  const handleCustomerChange = (field: keyof Customer, value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }))
  }

  const handleLogSale = async () => {
    if (!product || !customer.name || !customer.mobile) return

    const saleData = {
      productId: product.id,
      customer,
      discount,
      location: location || { lat: 0, lng: 0 },
      timestamp: new Date().toISOString()
    }

    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      })
      if (res.ok) {
        alert('Sale logged successfully! SMS sent to customer.')
        // Reset form
        setScannedData(null)
        setProduct(null)
        setCustomer({ name: '', mobile: '', location: '' })
        setDiscount(0)
      }
    } catch (err) {
      console.error('Error logging sale:', err)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Scan Product & Log Sale</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Scan Product QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Scanner onScan={handleScan} />
          {scannedData && <p className="mt-2">Scanned: {scannedData}</p>}
        </CardContent>
      </Card>

      {product && (
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Name:</strong> {product.name}</p>
            <p><strong>Price:</strong> ₹{product.price}</p>
            <p><strong>Discount:</strong> {product.discount}%</p>
            <p><strong>Color:</strong> {product.color}</p>
            <p><strong>Quality:</strong> {product.quality}</p>
            {product.image && <img src={product.image} alt={product.name} className="w-32 h-32 mt-2" />}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={customer.name} onChange={(e) => handleCustomerChange('name', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="mobile">Mobile</Label>
            <Input id="mobile" value={customer.mobile} onChange={(e) => handleCustomerChange('mobile', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={customer.location} onChange={(e) => handleCustomerChange('location', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="discount">Discount (%)</Label>
            <Input id="discount" type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
          </div>
          {location && <p>Current Location: {location.lat}, {location.lng}</p>}
          {locationError && <p className="text-red-500">Location Error: {locationError}</p>}
        </CardContent>
      </Card>

      <Button onClick={handleLogSale} disabled={!product || !customer.name || !customer.mobile}>
        Log Sale
      </Button>
    </div>
  )
}
```