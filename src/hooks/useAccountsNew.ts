
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Account, AccountFromView } from '@/types/accountNew';

export function useAccountsNew() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const mapViewAccountToAccount = (viewAccount: AccountFromView): Account => {
    return {
      id: viewAccount.account_id,
      name: viewAccount.account_name,
      type: viewAccount.is_customer && viewAccount.is_vendor 
        ? 'both' 
        : viewAccount.is_customer 
          ? 'customer' 
          : viewAccount.is_vendor 
            ? 'vendor' 
            : 'customer', // Default to customer if undefined
      email: viewAccount.email_of_who_added || '',
      phone: viewAccount.phone || '',
      address: viewAccount.address || '',
      website: viewAccount.website || '',
      notes: viewAccount.notes || '',
      status: 'active', // Default status, not in view
      balance: viewAccount.balance || 0,
      glide_row_id: viewAccount.glide_row_id,
      accounts_uid: viewAccount.accounts_uid,
      photo: viewAccount.photo,
      created_at: viewAccount.created_at,
      updated_at: viewAccount.updated_at,
      // Additional fields from materialized view
      is_customer: viewAccount.is_customer,
      is_vendor: viewAccount.is_vendor,
      invoice_count: viewAccount.invoice_count || 0,
      total_invoiced: viewAccount.total_invoiced || 0,
      total_paid: viewAccount.total_paid || 0,
      last_invoice_date: viewAccount.last_invoice_date,
      last_payment_date: viewAccount.last_payment_date,
    };
  };

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('mv_account_details')
        .select('*')
        .order('account_name', { ascending: true });
      
      if (error) throw error;
      
      const mappedAccounts = (data || []).map((account) => mapViewAccountToAccount(account as AccountFromView));
      setAccounts(mappedAccounts);
      
      return mappedAccounts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch accounts';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getAccount = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('mv_account_details')
        .select('*')
        .eq('account_id', id)
        .single();
      
      if (error) throw error;
      
      return mapViewAccountToAccount(data as AccountFromView);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch account';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  // Add account still needs to use the original gl_accounts table
  const addAccount = useCallback(async (accountData: Omit<Account, 'id' | 'created_at' | 'updated_at' | 'is_customer' | 'is_vendor' | 'invoice_count' | 'total_invoiced' | 'total_paid' | 'last_invoice_date' | 'last_payment_date'>) => {
    try {
      // Map from Account to gl_accounts structure
      const { data, error } = await supabase
        .from('gl_accounts')
        .insert({
          account_name: accountData.name,
          client_type: accountData.type,
          email_of_who_added: accountData.email,
          glide_row_id: 'A-' + Date.now(), // Generate a temporary ID for Glide sync
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Fetch the newly created account from the materialized view to get all the details
      const newAccount = await getAccount(data.id);
      
      if (newAccount) {
        setAccounts(prev => [...prev, newAccount]);
      }
      
      toast({
        title: 'Account Created',
        description: `${accountData.name} has been added successfully.`,
      });
      
      return newAccount;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    }
  }, [toast, getAccount]);

  const updateAccount = useCallback(async (id: string, accountData: Partial<Account>) => {
    try {
      // Convert from Account format to gl_accounts format
      const updateData: Partial<any> = {};
      if (accountData.name) updateData.account_name = accountData.name;
      if (accountData.type) updateData.client_type = accountData.type;
      if (accountData.email) updateData.email_of_who_added = accountData.email;
      
      const { error } = await supabase
        .from('gl_accounts')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Fetch the updated account from the materialized view
      const updatedAccount = await getAccount(id);
      
      if (updatedAccount) {
        setAccounts(prev => prev.map(account => 
          account.id === id ? updatedAccount : account
        ));
      }
      
      toast({
        title: 'Account Updated',
        description: `${accountData.name || 'Account'} has been updated successfully.`,
      });
      
      return updatedAccount;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update account';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    }
  }, [toast, getAccount]);

  const deleteAccount = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('gl_accounts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setAccounts(prev => prev.filter(account => account.id !== id));
      
      toast({
        title: 'Account Deleted',
        description: 'The account has been deleted successfully.',
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete account';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    isLoading,
    error,
    fetchAccounts,
    getAccount,
    addAccount,
    updateAccount,
    deleteAccount
  };
}
