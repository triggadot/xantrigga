
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('gl_products')
        .select('*, gl_accounts(account_name, accounts_uid)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mappedProducts = (data || []).map((product): Product => ({
        id: product.id,
        name: product.display_name || product.new_product_name || product.vendor_product_name || 'Unnamed Product',
        sku: product.glide_row_id,
        description: product.purchase_notes || '',
        price: 0, // Would need to be calculated from invoice lines
        cost: product.cost || 0,
        quantity: product.total_qty_purchased || 0,
        category: product.category || '',
        status: 'active',
        imageUrl: product.product_image1 || '',
        vendorName: product.gl_accounts?.account_name || '',
        vendorId: product.rowid_accounts || '',
        createdAt: new Date(product.created_at),
        updatedAt: new Date(product.updated_at),
        // Add additional fields from the database
        isSample: product.samples || false,
        isFronted: product.fronted || false,
        isMiscellaneous: product.miscellaneous_items || false,
        purchaseDate: product.product_purchase_date ? new Date(product.product_purchase_date) : null,
        frontedTerms: product.terms_for_fronted_product || '',
        rawData: product
      }));
      
      setProducts(mappedProducts);
      setIsLoading(false);
      return mappedProducts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsLoading(false);
      return [];
    }
  }, [toast]);

  const getProduct = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('gl_products')
        .select('*, gl_accounts(account_name, accounts_uid)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!data) throw new Error('Product not found');
      
      return {
        id: data.id,
        name: data.display_name || data.new_product_name || data.vendor_product_name || 'Unnamed Product',
        sku: data.glide_row_id,
        description: data.purchase_notes || '',
        price: 0, // Would need to be calculated from invoice lines
        cost: data.cost || 0,
        quantity: data.total_qty_purchased || 0,
        category: data.category || '',
        status: 'active',
        imageUrl: data.product_image1 || '',
        vendorName: data.gl_accounts?.account_name || '',
        vendorId: data.rowid_accounts || '',
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        // Add additional fields
        isSample: data.samples || false,
        isFronted: data.fronted || false,
        isMiscellaneous: data.miscellaneous_items || false,
        purchaseDate: data.product_purchase_date ? new Date(data.product_purchase_date) : null,
        frontedTerms: data.terms_for_fronted_product || '',
        rawData: data
      } as Product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  const createProduct = useCallback(async (product: Partial<Product>) => {
    setIsLoading(true);
    try {
      // Generate a glide_row_id for new products
      const tempGlideRowId = `temp_${uuidv4()}`;
      
      const { data, error } = await supabase
        .from('gl_products')
        .insert({
          display_name: product.name,
          new_product_name: product.name,
          vendor_product_name: product.name, // Use the same name for both fields
          cost: product.cost || 0,
          total_qty_purchased: product.quantity || 0,
          category: product.category || null,
          product_image1: product.imageUrl || null,
          purchase_notes: product.description || null,
          glide_row_id: tempGlideRowId,
          rowid_accounts: product.vendorId || null,
          samples: product.isSample || false,
          fronted: product.isFronted || false,
          miscellaneous_items: product.isMiscellaneous || false,
          product_purchase_date: product.purchaseDate instanceof Date ? product.purchaseDate.toISOString() : null,
          terms_for_fronted_product: product.frontedTerms || null
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
      
      await fetchProducts();
      setIsLoading(false);
      
      return data ? data[0] : null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsLoading(false);
      return null;
    }
  }, [toast, fetchProducts]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('gl_products')
        .update({
          display_name: updates.name,
          new_product_name: updates.name,
          vendor_product_name: updates.name, // Update both name fields for consistency
          cost: updates.cost,
          total_qty_purchased: updates.quantity,
          category: updates.category,
          product_image1: updates.imageUrl,
          purchase_notes: updates.description,
          rowid_accounts: updates.vendorId,
          samples: updates.isSample,
          fronted: updates.isFronted,
          miscellaneous_items: updates.isMiscellaneous,
          product_purchase_date: updates.purchaseDate instanceof Date ? updates.purchaseDate.toISOString() : null,
          terms_for_fronted_product: updates.frontedTerms
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      
      await fetchProducts();
      setIsLoading(false);
      
      return data ? data[0] : null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsLoading(false);
      return null;
    }
  }, [toast, fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('gl_products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  }, [toast]);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
  };
}
