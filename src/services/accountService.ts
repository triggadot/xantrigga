
import { supabase } from '@/integrations/supabase/client';
import { Account, AccountFromView } from '@/types/accountNew';
import { mapViewAccountToAccount, extractAccountFlags } from '@/utils/accountMapper';

/**
 * Fetches all accounts from the database
 */
export const fetchAllAccounts = async () => {
  const { data, error } = await supabase
    .from('mv_account_details')
    .select('*')
    .order('account_name', { ascending: true });
  
  if (error) throw error;
  
  return (data || []).map((account) => 
    mapViewAccountToAccount(account as unknown as AccountFromView)
  );
};

/**
 * Fetches a single account by ID
 */
export const fetchAccountById = async (id: string) => {
  const { data, error } = await supabase
    .from('mv_account_details')
    .select('*')
    .eq('account_id', id)
    .single();
  
  if (error) throw error;
  
  return mapViewAccountToAccount(data as unknown as AccountFromView);
};

/**
 * Creates a new account
 */
export const createAccount = async (accountData: Omit<Account, 'id' | 'created_at' | 'updated_at' | 'is_customer' | 'is_vendor' | 'invoice_count' | 'total_invoiced' | 'total_paid' | 'last_invoice_date' | 'last_payment_date'>) => {
  // Set is_customer and is_vendor based on type
  const { is_customer, is_vendor } = extractAccountFlags(accountData.type);
  
  // Map from Account to gl_accounts structure
  const { data, error } = await supabase
    .from('gl_accounts')
    .insert({
      account_name: accountData.name,
      client_type: accountData.type,
      is_customer: is_customer,
      is_vendor: is_vendor,
      glide_row_id: accountData.glide_row_id || ('A-' + Date.now()), // Generate a temporary ID for Glide sync
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

/**
 * Updates an existing account
 */
export const updateAccount = async (id: string, accountData: Partial<Account>) => {
  // Convert from Account format to gl_accounts format
  const updateData: Record<string, any> = {};
  if (accountData.name) updateData.account_name = accountData.name;
  if (accountData.type) {
    updateData.client_type = accountData.type;
    // Set is_customer and is_vendor based on type
    const { is_customer, is_vendor } = extractAccountFlags(accountData.type);
    updateData.is_customer = is_customer;
    updateData.is_vendor = is_vendor;
  }
  
  const { error } = await supabase
    .from('gl_accounts')
    .update(updateData)
    .eq('id', id);
  
  if (error) throw error;
};

/**
 * Deletes an account by ID
 */
export const deleteAccount = async (id: string) => {
  const { error } = await supabase
    .from('gl_accounts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
