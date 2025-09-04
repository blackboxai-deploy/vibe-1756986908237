```tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    discountPercent: 0,
    costPerPiece: 0,
    color: '',
    quality: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price.toString());
    formData.append('discountPercent', newProduct.discountPercent.toString());
    formData.append('costPerPiece', newProduct.costPerPiece.toString());
    formData.append('color', newProduct.color);
    formData.append('quality', newProduct.quality);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const res = await fetch('/api/products', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      fetchProducts();
      setNewProduct({
        name: '',
        price: 0,
        discountPercent: 0,
        costPerPiece: 0,
        color: '',
        quality: '',
        imageUrl: '',
      });
      setImageFile(null);
      setIsDialogOpen(false);
    }
  };

  const generateQR = (product: Product) => {
    const qrData = JSON.stringify({
      id: product.id,
      name: product.name,
      price: product.price,
      discountPercent: product.discountPercent,
      color: product.color,
      quality: product.quality,
      imageUrl: product.imageUrl,
    });
    return qrData;
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={newProduct.discountPercent}
                    onChange={(e) => setNewProduct({ ...newProduct, discountPercent: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="cost">Cost per Piece (₹)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={newProduct.costPerPiece}
                    onChange={(e) => setNewProduct({ ...newProduct, costPerPiece: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={newProduct.color}
                    onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="quality">Quality</Label>
                  <Input
                    id="quality"
                    value={newProduct.quality}
                    onChange={(e) => setNewProduct({ ...newProduct, quality: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </div>
                <Button onClick={handleAddProduct}>Add Product</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>QR Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>{product.discountPercent}%</TableCell>
                  <TableCell>₹{product.costPerPiece}</TableCell>
                  <TableCell>{product.color}</TableCell>
                  <TableCell>{product.quality}</TableCell>
                  <TableCell>
                    {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-16 h-16" />}
                  </TableCell>
                  <TableCell>
                    <QRCodeSVG value={generateQR(product)} size={64} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```