```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import QRCode from "qrcode"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    return qrCodeDataURL
  } catch (err) {
    console.error(err)
    throw new Error('Failed to generate QR code')
  }
}

export function calculateProfit(sellingPrice: number, discountPercent: number, costPerPiece: number): number {
  const discountedPrice = sellingPrice * (1 - discountPercent / 100)
  return discountedPrice - costPerPiece
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount)
}

export function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      }
    )
  })
}
```