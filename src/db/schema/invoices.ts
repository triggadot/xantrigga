
export const glInvoicesSchema = {
  balance: "number",
  created_at: "string",
  created_timestamp: "string",
  doc_glideforeverlink: "string",
  glide_row_id: "string",
  id: "string",
  invoice_order_date: "string",
  notes: "string",
  payment_status: "string",
  processed: "boolean",
  rowid_accounts: "string",
  submitted_timestamp: "string",
  total_amount: "number",
  total_paid: "number",
  updated_at: "string",
  user_email: "string"
  // Removed due_date, tax_rate, and tax_amount which don't exist in the database
};
