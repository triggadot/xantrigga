
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { InvoiceForm } from '@/components/invoices/form/InvoiceForm';
import { useInvoicesNew } from '@/hooks/invoices/useInvoicesNew';
import { useToast } from '@/hooks/use-toast';
import { InvoiceWithDetails } from '@/types/invoiceView';

const EditInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoice } = useInvoicesNew();
  const [invoice, setInvoice] = useState<InvoiceWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const invoiceData = await getInvoice(id);
        if (invoiceData) {
          // Ensure we have all required fields for InvoiceWithDetails
          const fullInvoice: InvoiceWithDetails = {
            ...invoiceData,
            invoiceDate: invoiceData.date,
            subtotal: invoiceData.total,
            amountPaid: invoiceData.totalPaid,
            status: (invoiceData.status as "draft" | "paid" | "partial" | "sent" | "overdue") || "draft"
          };
          setInvoice(fullInvoice);
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast({
          title: 'Error',
          description: 'Failed to load invoice details.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [id, getInvoice, toast]);

  const handleBackClick = () => {
    navigate(`/invoices/${id}`);
  };

  const handleSuccess = (invoiceId: string) => {
    navigate(`/invoices/${invoiceId}`);
  };

  if (isLoading) {
    return (
      <div className="container py-6 max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container py-6 max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Invoice Not Found</h1>
        </div>
        <div className="bg-muted/40 rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">The invoice you're trying to edit could not be found.</p>
          <Button onClick={() => navigate('/invoices')}>Return to Invoices</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" onClick={handleBackClick}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Invoice {invoice.invoiceNumber}</h1>
      </div>
      <InvoiceForm 
        initialData={invoice} 
        isEdit={true}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default EditInvoice;
