```tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Vastratrota</h1>
        <p className="text-gray-600 mb-8">
          Mobile Clothing Distribution & Sales Management System for Malvi Company
        </p>
        <div className="space-y-4">
          <Link href="/admin/dashboard">
            <Button className="w-full">Admin Dashboard</Button>
          </Link>
          <Link href="/dealer/portal">
            <Button variant="outline" className="w-full">Dealer Portal</Button>
          </Link>
          <Link href="/salesperson/dashboard">
            <Button variant="outline" className="w-full">Salesperson App</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```