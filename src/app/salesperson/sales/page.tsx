```tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useGeolocation } from '@/hooks/useGeolocation'
import { Scanner } from '@/components/Scanner'
import { Product, Sale } from '@/types'

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [customerName, setCustomerName] = useState('')
  const [customerMobile, setCustomerMobile] = useState('')
  const [discount, setDiscount] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [scanning, setScanning] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const { location, error: locationError } = useGeolocation()

  useEffect(() => {
    // Fetch products from API
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err))
  }, [])

  const handleScan = (result: string) => {
    // Parse QR code result to get product ID or customer details
    try {
      const data = JSON.parse(result)
      if (data.productId) {
        setSelectedProduct(data.productId)
      } else if (data.customerName && data.customerMobile) {
        setCustomerName(data.customerName)
        setCustomerMobile(data.customerMobile)
      }
    } catch (e) {
      setAlert({ type: 'error', message: 'Invalid QR code scanned.' })
    }
    setScanning(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct || !customerName || !customerMobile || !location) {
      setAlert({ type: 'error', message: 'Please fill all fields and ensure location is available.' })
      return
    }

    const sale: Omit<Sale, 'id'> = {
      productId: selectedProduct,
      customerName,
      customerMobile,
      discount,
      quantity,
      location,
      timestamp: new Date().toISOString(),
      salespersonId: 'current-user-id' // Replace with actual user ID from auth
    }

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sale)
      })
      if (response.ok) {
        setAlert({ type: 'success', message: 'Sale logged successfully!' })
        // Reset form
        setSelectedProduct('')
        setCustomerName('')
        setCustomerMobile('')
        setDiscount(0)
        setQuantity(1)
      } else {
        setAlert({ type: 'error', message: 'Failed to log sale.' })
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Error logging sale.' })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Log a Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="product">Select Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - ₹{product.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="customerMobile">Customer Mobile</Label>
              <Input
                id="customerMobile"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                placeholder="Enter customer mobile"
              />
            </div>
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="Enter discount percentage"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <Label>Location</Label>
              {location ? (
                <p>Lat: {location.lat}, Lng: {location.lng}</p>
              ) : (
                <p>{locationError || 'Fetching location...'}</p>
              )}
            </div>
            <Button type="button" onClick={() => setScanning(true)}>
              Scan QR Code
            </Button>
            <Button type="submit">Log Sale</Button>
          </form>
          {alert && (
            <Alert className={alert.type === 'success' ? 'border-green-500' : 'border-red-500'}>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      {scanning && (
        <Scanner onScan={handleScan} onClose={() => setScanning(false)} />
      )}
    </div>
  )
}
```