
import { useState } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { VendorPayment } from '@/types/purchaseOrder';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { PaymentForm } from './PaymentForm';
import { usePurchaseOrdersView } from '@/hooks/purchase-orders/usePurchaseOrdersView';

export interface PaymentsTableProps {
  payments: VendorPayment[];
  purchaseOrderId: string;
  purchaseOrderGlideRowId: string;
  vendorId: string;
  purchaseOrderTotal: number;
  purchaseOrderBalance: number;
  status: string;
  onDeletePayment: (paymentId: string) => void;
}

export function PaymentsTable({ 
  payments, 
  purchaseOrderId, 
  purchaseOrderGlideRowId,
  vendorId, 
  purchaseOrderTotal,
  purchaseOrderBalance,
  status,
  onDeletePayment 
}: PaymentsTableProps) {
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<VendorPayment | null>(null);
  const { addPayment, updatePayment } = usePurchaseOrdersView();
  
  const handleAddEditPayment = async (data: Partial<VendorPayment>) => {
    if (currentPayment) {
      await updatePayment.mutateAsync({ 
        id: currentPayment.id, 
        data 
      });
    } else {
      await addPayment.mutateAsync({ 
        purchaseOrderGlideId: purchaseOrderGlideRowId,
        data,
        vendorId
      });
    }
    setCurrentPayment(null);
    setIsAddPaymentOpen(false);
  };

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const isEditable = status !== 'complete' && status !== 'paid';

  return (
    <>
      <div className="px-4 py-3 bg-white border-b flex justify-between items-center">
        <h3 className="font-semibold">Payments</h3>
        {isEditable && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setCurrentPayment(null);
              setIsAddPaymentOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Payment
          </Button>
        )}
      </div>
      
      {payments.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          No payments recorded for this purchase order yet.
          {isEditable && (
            <div className="mt-2">
              <Button
                variant="link"
                onClick={() => {
                  setCurrentPayment(null);
                  setIsAddPaymentOpen(true);
                }}
              >
                Record a payment
              </Button>
            </div>
          )}
        </div>
      ) : (
        <ScrollArea className="max-h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                {isEditable && <TableHead className="w-[100px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {payment.date instanceof Date 
                      ? format(payment.date, 'PP') 
                      : format(new Date(payment.date || new Date()), 'PP')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {payment.method || 'Payment'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {payment.notes || '-'}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  {isEditable && (
                    <TableCell>
                      <div className="flex justify-end space-x-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setCurrentPayment(payment);
                            setIsAddPaymentOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => onDeletePayment(payment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
      
      <div className="px-4 py-3 border-t bg-white/50">
        <div className="flex justify-end">
          <div className="w-1/3 space-y-1">
            <div className="flex justify-between font-medium">
              <span>Total Paid:</span>
              <span>{formatCurrency(totalPaid)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Balance:</span>
              <span>{formatCurrency(purchaseOrderTotal - totalPaid)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentPayment ? 'Edit Payment' : 'Add Payment'}</DialogTitle>
          </DialogHeader>
          <PaymentForm
            payment={currentPayment || undefined}
            vendorId={vendorId}
            purchaseOrderTotal={purchaseOrderTotal}
            purchaseOrderBalance={purchaseOrderBalance}
            onSubmit={handleAddEditPayment}
            onCancel={() => {
              setCurrentPayment(null);
              setIsAddPaymentOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
