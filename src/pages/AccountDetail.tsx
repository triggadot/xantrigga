import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Building, Edit, Trash2, Package, FileText } from 'lucide-react';
import { useAccountsNew } from '@/hooks/useAccountsNew';
import { useAccount } from '@/hooks/useAccount';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format-utils';
import { useInvoicesNew } from '@/hooks/invoices/useInvoicesNew';
import { usePurchaseOrders } from '@/hooks/usePurchaseOrders';
import PurchaseOrderList from '@/components/purchase-orders/PurchaseOrderList';
import InvoiceList from '@/components/invoices/list/InvoiceList';
import { AmountDisplay } from '@/components/invoices/shared/AmountDisplay';

const AccountDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { account, isLoading, error } = useAccount(id || '');
  const [activeTab, setActiveTab] = useState('overview');
  const [accountInvoices, setAccountInvoices] = useState<any[]>([]);
  const [accountPurchaseOrders, setAccountPurchaseOrders] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [purchaseOrdersLoading, setPurchaseOrdersLoading] = useState(false);
  const invoicesHook = useInvoicesNew();
  const purchaseOrdersHook = usePurchaseOrders();

  const getBalanceVariant = (balance: number = 0) => {
    if (balance > 0) {
      return 'success';
    } else if (balance < 0) {
      return 'destructive';
    }
    return 'default';
  };

  useEffect(() => {
    if (account) {
      const fetchInvoices = async () => {
        setInvoicesLoading(true);
        try {
          const { data: allInvoices } = await invoicesHook.fetchInvoices();
          const customerInvoices = allInvoices?.filter(
            inv => inv.customerId === account.id
          ) || [];
          setAccountInvoices(customerInvoices);
        } catch (err) {
          console.error("Error fetching invoices:", err);
        } finally {
          setInvoicesLoading(false);
        }
      };

      const fetchPurchaseOrders = async () => {
        setPurchaseOrdersLoading(true);
        try {
          const { data } = await purchaseOrdersHook.fetchPurchaseOrders();
          const filtered = data?.filter(po => po.accountId === account.id) || [];
          setAccountPurchaseOrders(filtered);
        } catch (err) {
          console.error("Error fetching purchase orders:", err);
        } finally {
          setPurchaseOrdersLoading(false);
        }
      };

      if (account.is_customer) {
        fetchInvoices();
      }
      
      if (account.is_vendor) {
        fetchPurchaseOrders();
      }
    }
  }, [account, invoicesHook, purchaseOrdersHook]);

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/invoices/${invoiceId}`);
  };

  const handleViewPurchaseOrder = (poId: string) => {
    navigate(`/purchase-orders/${poId}`);
  };

  if (isLoading) {
    return (
      <div className="container py-6 space-y-6">
        <div>Loading...</div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold">Account not found</h1>
        </div>
        <Card>
          <CardContent className="py-6">
            <p className="text-muted-foreground">The account you're looking for doesn't exist or you don't have permission to view it.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <Helmet>
        <title>{account.name} | Billow</title>
      </Helmet>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/accounts')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Accounts
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{account.name}</h1>
            <div className="flex space-x-2 mt-1">
              {account.is_customer && (
                <Badge variant="outline">Customer</Badge>
              )}
              {account.is_vendor && (
                <Badge variant="outline">Vendor</Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate(`/accounts/${account.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {account.is_customer && (
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          )}
          {account.is_vendor && (
            <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{account.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {account.is_customer && account.is_vendor 
                        ? 'Customer & Vendor' 
                        : account.is_customer 
                          ? 'Customer' 
                          : account.is_vendor 
                            ? 'Vendor' 
                            : 'Account'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {account.is_customer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Invoices</div>
                      <div className="text-2xl font-bold">{account.invoice_count || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Invoiced</div>
                      <div className="text-2xl font-bold">{formatCurrency(account.total_invoiced || 0)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Paid</div>
                      <div className="text-2xl font-bold">{formatCurrency(account.total_paid || 0)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Balance</div>
                      <div className={`text-2xl font-bold`}>
                        <AmountDisplay 
                          amount={account.balance || 0} 
                          variant={getBalanceVariant(account.balance)}
                        />
                      </div>
                    </div>
                  </div>
                  {account.last_invoice_date && (
                    <div>
                      <div className="text-sm text-muted-foreground">Last Invoice</div>
                      <div>{new Date(account.last_invoice_date).toLocaleDateString()}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {account.is_vendor && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vendor Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Open Purchase Orders</div>
                      <div className="text-2xl font-bold">{accountPurchaseOrders.filter(po => po.status !== 'complete').length}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Ordered</div>
                      <div className="text-2xl font-bold">{formatCurrency(accountPurchaseOrders.reduce((sum, po) => sum + (po.total || 0), 0))}</div>
                    </div>
                    {account.is_vendor && (
                      <div className="col-span-2">
                        <div className="text-sm text-muted-foreground">Balance (Negative = We owe vendor)</div>
                        <div className="text-2xl font-bold">
                          <AmountDisplay 
                            amount={account.balance || 0} 
                            variant={getBalanceVariant(account.balance)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity</CardTitle>
              <CardDescription>Recent transactions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-6">No recent activity to display.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {account.is_customer && (
          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Invoices</CardTitle>
                  <CardDescription>All invoices for this customer</CardDescription>
                </div>
                <Button onClick={() => navigate('/invoices/new', { state: { customerId: account.id } })}>
                  <FileText className="mr-2 h-4 w-4" /> New Invoice
                </Button>
              </CardHeader>
              <CardContent>
                <InvoiceList 
                  invoices={accountInvoices.map(inv => ({
                    id: inv.id,
                    invoiceNumber: inv.invoiceNumber,
                    customerName: account.name,
                    date: new Date(inv.date),
                    total: inv.total,
                    status: inv.status
                  }))}
                  isLoading={invoicesLoading}
                  error={null}
                  onView={handleViewInvoice}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {account.is_vendor && (
          <TabsContent value="purchase-orders" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Purchase Orders</CardTitle>
                  <CardDescription>All purchase orders for this vendor</CardDescription>
                </div>
                <Button onClick={() => navigate('/purchase-orders/new', { state: { vendorId: account.id } })}>
                  <Package className="mr-2 h-4 w-4" /> New Purchase Order
                </Button>
              </CardHeader>
              <CardContent>
                <PurchaseOrderList 
                  purchaseOrders={accountPurchaseOrders} 
                  isLoading={purchaseOrdersLoading} 
                  error={null} 
                  onView={handleViewPurchaseOrder} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AccountDetail;
