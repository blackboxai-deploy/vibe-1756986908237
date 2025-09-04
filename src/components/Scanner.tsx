```tsx
import React, { useState } from 'react';
import QrScanner from 'react-qr-barcode-scanner';

interface ScannerProps {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, onError }) => {
  const [scanning, setScanning] = useState(false);

  const handleScan = (err: any, result: any) => {
    if (result) {
      onScan(result.text);
      setScanning(false);
    }
    if (err) {
      onError?.(err.message);
    }
  };

  const startScanning = () => {
    setScanning(true);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={scanning ? stopScanning : startScanning}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {scanning ? 'Stop Scanning' : 'Start Scanning'}
      </button>
      {scanning && (
        <div className="w-full max-w-md">
          <QrScanner
            onUpdate={handleScan}
            style={{ width: '100%' }}
          />
        </div>
      )}
      <p className="text-sm text-gray-600">
        Point your camera at a QR code to scan product or customer details.
      </p>
    </div>
  );
};

export default Scanner;
```