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
  purchaseHistory: Sale[];
}

export interface Sale {
  id: string;
  salespersonId: string;
  productId: string;
  customerId: string;
  discountApplied: number;
  timestamp: Date;
  geolocation: Geolocation;
  quantity: number;
  totalAmount: number;
}

export interface Geolocation {
  lat: number;
  lng: number;
}

export interface Dealer {
  id: string;
  name: string;
  area: string;
  stockLevels: { [productId: string]: number };
  paymentStatus: 'paid' | 'pending' | 'overdue';
  overdueTriggers: number; // e.g., days since last order
}

export interface Inventory {
  dealerId: string;
  productId: string;
  availableStock: number;
  soldStock: number;
}

export interface Accounting {
  transactionId: string;
  dealerId?: string;
  salespersonId?: string;
  revenue: number;
  costs: number;
  profit: number;
  date: Date;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'dealer' | 'salesperson';
  name: string;
  area?: string; // for dealers/salespeople
}

export interface Alert {
  id: string;
  type: 'lowStock' | 'dealerDelay' | 'paymentIssue';
  message: string;
  targetId: string; // dealer or product id
  timestamp: Date;
}