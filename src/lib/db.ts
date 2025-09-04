```typescript
// src/lib/db.ts
// In-memory database for Vastratrota app (mock backend; replace with real DB in production)

export interface Product {
  id: string;
  name: string;
  price: number;
  discountPercent: number;
  costPerPiece: number;
  qrCode: string;
  barcode: string;
  imageUrl: string;
  color: string;
  quality: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  location: string;
  purchaseHistory: string[]; // Array of sale IDs
}

export interface Sale {
  id: string;
  salespersonId: string;
  productId: string;
  customerId: string;
  discountApplied: number;
  timestamp: Date;
  geolocation: { lat: number; lng: number };
  amount: number;
}

export interface Dealer {
  id: string;
  name: string;
  area: string;
  stockLevels: { [productId: string]: number };
  paymentStatus: 'paid' | 'pending' | 'overdue';
  lastStockUpdate: Date;
}

export interface Inventory {
  [productId: string]: number; // Total stock per product
}

// In-memory storage
const products: Product[] = [];
const customers: Customer[] = [];
const sales: Sale[] = [];
const dealers: Dealer[] = [];
const inventory: Inventory = {};

// Utility functions
export const getProducts = (): Product[] => products;
export const addProduct = (product: Omit<Product, 'id'>): Product => {
  const newProduct = { ...product, id: Date.now().toString() };
  products.push(newProduct);
  return newProduct;
};
export const updateProduct = (id: string, updates: Partial<Product>): Product | null => {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates };
  return products[index];
};
export const deleteProduct = (id: string): boolean => {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
};

export const getCustomers = (): Customer[] => customers;
export const addCustomer = (customer: Omit<Customer, 'id' | 'purchaseHistory'>): Customer => {
  const newCustomer = { ...customer, id: Date.now().toString(), purchaseHistory: [] };
  customers.push(newCustomer);
  return newCustomer;
};
export const updateCustomer = (id: string, updates: Partial<Customer>): Customer | null => {
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) return null;
  customers[index] = { ...customers[index], ...updates };
  return customers[index];
};

export const getSales = (): Sale[] => sales;
export const addSale = (sale: Omit<Sale, 'id'>): Sale => {
  const newSale = { ...sale, id: Date.now().toString() };
  sales.push(newSale);
  // Update customer purchase history
  const customer = customers.find(c => c.id === sale.customerId);
  if (customer) customer.purchaseHistory.push(newSale.id);
  // Update inventory
  if (inventory[sale.productId]) inventory[sale.productId] -= 1;
  return newSale;
};

export const getDealers = (): Dealer[] => dealers;
export const addDealer = (dealer: Omit<Dealer, 'id'>): Dealer => {
  const newDealer = { ...dealer, id: Date.now().toString() };
  dealers.push(newDealer);
  return newDealer;
};
export const updateDealer = (id: string, updates: Partial<Dealer>): Dealer | null => {
  const index = dealers.findIndex(d => d.id === id);
  if (index === -1) return null;
  dealers[index] = { ...dealers[index], ...updates };
  return dealers[index];
};

export const getInventory = (): Inventory => inventory;
export const updateInventory = (productId: string, quantity: number): void => {
  inventory[productId] = (inventory[productId] || 0) + quantity;
};

// Sample data for demo
addProduct({
  name: 'Kurti',
  price: 200,
  discountPercent: 10,
  costPerPiece: 50,
  qrCode: 'sample-qr',
  barcode: 'sample-barcode',
  imageUrl: '/kurti.jpg',
  color: 'Red',
  quality: 'High',
});
updateInventory('1', 100); // Assuming ID from addProduct
addDealer({
  name: 'Dealer1',
  area: 'Mumbai',
  stockLevels: { '1': 50 },
  paymentStatus: 'paid',
  lastStockUpdate: new Date(),
});
```