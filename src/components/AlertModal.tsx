```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Alert {
  id: string;
  productName: string;
  currentStock: number;
  threshold: number;
  message: string;
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  onViewInventory?: () => void;
}

export function AlertModal({ isOpen, onClose, alerts, onViewInventory }: AlertModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Stock Alerts
          </DialogTitle>
          <DialogDescription>
            The following products are running low on stock. Please review and restock as needed.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No alerts at this time.</p>
          ) : (
            <ul className="space-y-2">
              {alerts.map((alert) => (
                <li key={alert.id} className="p-3 border rounded-md bg-yellow-50">
                  <p className="font-medium">{alert.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    Current Stock: {alert.currentStock} | Threshold: {alert.threshold}
                  </p>
                  <p className="text-sm">{alert.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Dismiss
          </Button>
          {onViewInventory && (
            <Button onClick={onViewInventory}>
              View Inventory
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```