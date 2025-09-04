```tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface Sale {
  id: string
  salespersonId: string
  productId: string
  customerId: string
  discount: number
  amount: number
  location: string
  timestamp: string
}

interface Accounting {
  totalRevenue: number
  totalCosts: number
  totalProfits: number
  collectionsBySalesperson: { [key: string]: number }
  profitsByProduct: { [key: string]: number }
}

export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [accounting, setAccounting] = useState<Accounting | null>(null)
  const [filter, setFilter] = useState({ location: '', product: '', salesperson: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSales()
    fetchAccounting()
  }, [])

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/sales')
      const data = await response.json()
      setSales(data)
    } catch (error) {
      console.error('Error fetching sales:', error)
    }
  }

  const fetchAccounting = async () => {
    try {
      const response = await fetch('/api/accounting')
      const data = await response.json()
      setAccounting(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching accounting:', error)
      setLoading(false)
    }
  }

  const filteredSales = sales.filter(sale =>
    (filter.location === '' || sale.location.toLowerCase().includes(filter.location.toLowerCase())) &&
    (filter.product === '' || sale.productId.toLowerCase().includes(filter.product.toLowerCase())) &&
    (filter.salesperson === '' || sale.salespersonId.toLowerCase().includes(filter.salesperson.toLowerCase()))
  )

  if (loading) return <div>Loading reports...</div>

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sales & Accounting Reports</h1>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input
            placeholder="Filter by Location"
            value={filter.location}
            onChange={(e) => setFilter({ ...filter, location: e.target.value })}
          />
          <Input
            placeholder="Filter by Product ID"
            value={filter.product}
            onChange={(e) => setFilter({ ...filter, product: e.target.value })}
          />
          <Input
            placeholder="Filter by Salesperson ID"
            value={filter.salesperson}
            onChange={(e) => setFilter({ ...filter, salesperson: e.target.value })}
          />
          <Button onClick={() => setFilter({ location: '', product: '', salesperson: '' })}>Clear Filters</Button>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sales Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salesperson ID</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Discount (%)</TableHead>
                <TableHead>Amount (₹)</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.salespersonId}</TableCell>
                  <TableCell>{sale.productId}</TableCell>
                  <TableCell>{sale.customerId}</TableCell>
                  <TableCell>{sale.discount}</TableCell>
                  <TableCell>{sale.amount}</TableCell>
                  <TableCell>{sale.location}</TableCell>
                  <TableCell>{new Date(sale.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Accounting Summary */}
      {accounting && (
        <Card>
          <CardHeader>
            <CardTitle>Accounting Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold">Total Revenue</h3>
                <p className="text-2xl">₹{accounting.totalRevenue}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Total Costs</h3>
                <p className="text-2xl">₹{accounting.totalCosts}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Total Profits</h3>
                <p className="text-2xl">₹{accounting.totalProfits}</p>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Collections by Salesperson</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Salesperson ID</TableHead>
                    <TableHead>Collection (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(accounting.collectionsBySalesperson).map(([id, amount]) => (
                    <TableRow key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>{amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Profits by Product</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Profit (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(accounting.profitsByProduct).map(([id, profit]) => (
                    <TableRow key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>{profit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```