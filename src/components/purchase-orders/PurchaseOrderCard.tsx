
import React from 'react';
import { PurchaseOrder } from '@/types/purchaseOrder';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format-utils';
import { ArrowRight, Calendar, FileText, User } from 'lucide-react';

interface PurchaseOrderCardProps {
  purchaseOrder: PurchaseOrder;
  onClick: () => void;
}

const PurchaseOrderCard: React.FC<PurchaseOrderCardProps> = ({ purchaseOrder, onClick }) => {
  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" | "success" | "warning" => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'sent':
        return 'default';
      case 'received':
        return 'default';
      case 'partial':
        return 'warning';
      case 'complete':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (date: Date) => {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div onClick={onClick} className="block transition-transform hover:translate-y-[-2px]">
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 truncate">PO #{purchaseOrder.number}</h3>
              
              <div className="flex gap-1 items-center text-sm text-muted-foreground mb-2">
                <User size={14} />
                <span className="truncate">{purchaseOrder.accountName}</span>
              </div>
              
              <div className="flex gap-1 items-center text-sm text-muted-foreground">
                <Calendar size={14} />
                <span>{formatDate(purchaseOrder.date)}</span>
              </div>
              
              <div className="flex gap-1 items-center text-sm text-muted-foreground">
                <FileText size={14} />
                <span>{purchaseOrder.product_count || 0} items</span>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <Badge 
                  variant={getStatusVariant(purchaseOrder.status)}
                  className="capitalize"
                >
                  {purchaseOrder.status}
                </Badge>
                
                <div className="text-right">
                  <div className="font-medium">
                    {formatCurrency(purchaseOrder.total_amount)}
                  </div>
                  {purchaseOrder.total_paid > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(purchaseOrder.total_paid)} paid
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseOrderCard;
