import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { DetailItem } from '@/components/common/DetailItem';
import { usePurchaseOrderDetail } from '@/hooks/purchase-orders/usePurchaseOrderDetail';
import { PurchaseOrder } from '@/types/purchase-orders';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const SkeletonDetails = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
};

const PurchaseOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { purchaseOrder, isLoading, error, getPurchaseOrder } = usePurchaseOrderDetail(id);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      getPurchaseOrder(id);
    }
  }, [id, getPurchaseOrder]);

  const handleBack = () => {
    navigate('/purchase-orders');
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating purchase order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SkeletonDetails />
    );
  }

  if (error) {
    const errorMessage = error ? (typeof error === 'object' && 'message' in error ? error.message : String(error)) : 'Unknown error';
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading purchase order: {errorMessage}</p>
        </div>
      </div>
    );
  }

  if (!purchaseOrder) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <h3 className="text-lg font-medium mb-4">Purchase Order Not Found</h3>
          <p className="text-muted-foreground mb-6">
            Failed to load purchase order details
          </p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Purchase Orders
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Purchase Order Details</h1>
        <Button onClick={handleBack} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>PO #{purchaseOrder.purchaseOrderUid || 'N/A'}</CardTitle>
            <div className="flex space-x-2">
              {isEditMode ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleEditToggle}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleEditToggle}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <DetailItem label="Vendor" value={purchaseOrder.vendorName} />
              <DetailItem 
                label="Date" 
                value={purchaseOrder.poDate ? format(new Date(purchaseOrder.poDate), 'PPP') : 'N/A'} 
              />
              <DetailItem label="Status" value={purchaseOrder.status} />
            </div>
            <div className="space-y-4">
              <DetailItem 
                label="Total Amount" 
                value={formatCurrency(purchaseOrder.totalAmount)} 
              />
              <DetailItem 
                label="Amount Paid" 
                value={formatCurrency(purchaseOrder.totalPaid)} 
              />
              <DetailItem 
                label="Balance" 
                value={formatCurrency(purchaseOrder.balance)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items Card */}
      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          {purchaseOrder.lineItems && purchaseOrder.lineItems.length > 0 ? (
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchaseOrder.lineItems.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(item.quantity * item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No line items found for this purchase order.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payments Card */}
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {purchaseOrder.vendorPayments && purchaseOrder.vendorPayments.length > 0 ? (
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchaseOrder.vendorPayments.map((payment, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.paymentDate ? format(new Date(payment.paymentDate), 'PPP') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.method || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No payments recorded for this purchase order.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseOrderDetail;
