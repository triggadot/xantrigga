
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { usePurchaseOrders } from '@/hooks/usePurchaseOrders';
import { PurchaseOrderCard } from '@/components/purchase-orders/PurchaseOrderCard';
import { PurchaseOrderWithVendor } from '@/types/purchaseOrder';

export default function PurchaseOrders() {
  const navigate = useNavigate();
  const { fetchPurchaseOrders, isLoading } = usePurchaseOrders();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderWithVendor[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    loadPurchaseOrders();
  }, []);
  
  const loadPurchaseOrders = async () => {
    const result = await fetchPurchaseOrders();
    if (!result.error) {
      setPurchaseOrders(result.data);
    }
  };
  
  const handleCreatePurchaseOrder = () => {
    navigate('/purchase-orders/new');
  };
  
  const handleViewPurchaseOrder = (id: string) => {
    navigate(`/purchase-orders/${id}`);
  };
  
  const filteredPurchaseOrders = purchaseOrders.filter(po => {
    if (activeTab === 'all') return true;
    if (activeTab === 'draft') return po.status === 'draft';
    if (activeTab === 'received') return po.status === 'received';
    if (activeTab === 'partial') return po.status === 'partial';
    if (activeTab === 'complete') return po.status === 'complete';
    return true;
  });

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
        <Button onClick={handleCreatePurchaseOrder}>
          <Plus className="mr-2 h-4 w-4" /> New Purchase Order
        </Button>
      </div>
      
      <Tabs 
        defaultValue="all" 
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="partial">Partial</TabsTrigger>
          <TabsTrigger value="complete">Complete</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredPurchaseOrders.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No purchase orders found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPurchaseOrders.map((po) => (
                <PurchaseOrderCard 
                  key={po.id} 
                  purchaseOrder={po} 
                  onClick={() => handleViewPurchaseOrder(po.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
