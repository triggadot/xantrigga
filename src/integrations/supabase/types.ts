export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_balance_update_queue: {
        Row: {
          created_at: string
          id: number
          rowid_accounts: string
        }
        Insert: {
          created_at?: string
          id?: number
          rowid_accounts: string
        }
        Update: {
          created_at?: string
          id?: number
          rowid_accounts?: string
        }
        Relationships: []
      }
      gl_accounts: {
        Row: {
          account_name: string | null
          accounts_uid: string
          balance: number | null
          client_type: string | null
          created_at: string | null
          customer_balance: number | null
          date_added_client: string | null
          email_of_who_added: string | null
          glide_row_id: string | null
          id: string
          photo: string | null
          updated_at: string | null
          vendor_balance: number | null
        }
        Insert: {
          account_name?: string | null
          accounts_uid?: string
          balance?: number | null
          client_type?: string | null
          created_at?: string | null
          customer_balance?: number | null
          date_added_client?: string | null
          email_of_who_added?: string | null
          glide_row_id?: string | null
          id?: string
          photo?: string | null
          updated_at?: string | null
          vendor_balance?: number | null
        }
        Update: {
          account_name?: string | null
          accounts_uid?: string
          balance?: number | null
          client_type?: string | null
          created_at?: string | null
          customer_balance?: number | null
          date_added_client?: string | null
          email_of_who_added?: string | null
          glide_row_id?: string | null
          id?: string
          photo?: string | null
          updated_at?: string | null
          vendor_balance?: number | null
        }
        Relationships: []
      }
      gl_connections: {
        Row: {
          api_key: string
          app_id: string
          app_name: string | null
          created_at: string | null
          id: string
          last_sync: string | null
          settings: Json | null
          status: string | null
        }
        Insert: {
          api_key: string
          app_id: string
          app_name?: string | null
          created_at?: string | null
          id?: string
          last_sync?: string | null
          settings?: Json | null
          status?: string | null
        }
        Update: {
          api_key?: string
          app_id?: string
          app_name?: string | null
          created_at?: string | null
          id?: string
          last_sync?: string | null
          settings?: Json | null
          status?: string | null
        }
        Relationships: []
      }
      gl_customer_credits: {
        Row: {
          created_at: string | null
          date_of_payment: string | null
          glide_row_id: string
          id: string
          payment_amount: number | null
          payment_note: string | null
          payment_type: string | null
          rowid_accounts: string | null
          rowid_estimates: string | null
          rowid_invoices: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_payment?: string | null
          glide_row_id: string
          id?: string
          payment_amount?: number | null
          payment_note?: string | null
          payment_type?: string | null
          rowid_accounts?: string | null
          rowid_estimates?: string | null
          rowid_invoices?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_payment?: string | null
          glide_row_id?: string
          id?: string
          payment_amount?: number | null
          payment_note?: string | null
          payment_type?: string | null
          rowid_accounts?: string | null
          rowid_estimates?: string | null
          rowid_invoices?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      gl_customer_payments: {
        Row: {
          created_at: string | null
          date_of_payment: string | null
          email_of_user: string | null
          glide_row_id: string
          id: string
          payment_amount: number | null
          payment_note: string | null
          rowid_accounts: string | null
          rowid_invoices: string | null
          type_of_payment: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_payment?: string | null
          email_of_user?: string | null
          glide_row_id: string
          id?: string
          payment_amount?: number | null
          payment_note?: string | null
          rowid_accounts?: string | null
          rowid_invoices?: string | null
          type_of_payment?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_payment?: string | null
          email_of_user?: string | null
          glide_row_id?: string
          id?: string
          payment_amount?: number | null
          payment_note?: string | null
          rowid_accounts?: string | null
          rowid_invoices?: string | null
          type_of_payment?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      gl_estimate_lines: {
        Row: {
          created_at: string | null
          date_of_sale: string | null
          glide_row_id: string
          id: string
          line_total: number | null
          product_name_display: string | null
          product_sale_note: string | null
          qty_sold: number | null
          rowid_estimates: string | null
          rowid_products: string | null
          sale_product_name: string | null
          selling_price: number | null
          total_stock_after_sell: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_sale?: string | null
          glide_row_id: string
          id?: string
          line_total?: number | null
          product_name_display?: string | null
          product_sale_note?: string | null
          qty_sold?: number | null
          rowid_estimates?: string | null
          rowid_products?: string | null
          sale_product_name?: string | null
          selling_price?: number | null
          total_stock_after_sell?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_sale?: string | null
          glide_row_id?: string
          id?: string
          line_total?: number | null
          product_name_display?: string | null
          product_sale_note?: string | null
          qty_sold?: number | null
          rowid_estimates?: string | null
          rowid_products?: string | null
          sale_product_name?: string | null
          selling_price?: number | null
          total_stock_after_sell?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      gl_estimates: {
        Row: {
          add_note: boolean | null
          balance: number | null
          created_at: string | null
          date_invoice_created_date: string | null
          estimate_date: string | null
          estimate_uid: string | null
          glide_pdf_url: string | null
          glide_pdf_url2: string | null
          glide_row_id: string
          id: string
          is_a_sample: boolean | null
          notes: string | null
          rowid_accounts: string | null
          rowid_invoices: string | null
          status: string | null
          supabase_pdf_url: string | null
          total_amount: number | null
          total_credits: number | null
          updated_at: string | null
          valid_final_create_invoice_clicked: boolean | null
        }
        Insert: {
          add_note?: boolean | null
          balance?: number | null
          created_at?: string | null
          date_invoice_created_date?: string | null
          estimate_date?: string | null
          estimate_uid?: string | null
          glide_pdf_url?: string | null
          glide_pdf_url2?: string | null
          glide_row_id: string
          id?: string
          is_a_sample?: boolean | null
          notes?: string | null
          rowid_accounts?: string | null
          rowid_invoices?: string | null
          status?: string | null
          supabase_pdf_url?: string | null
          total_amount?: number | null
          total_credits?: number | null
          updated_at?: string | null
          valid_final_create_invoice_clicked?: boolean | null
        }
        Update: {
          add_note?: boolean | null
          balance?: number | null
          created_at?: string | null
          date_invoice_created_date?: string | null
          estimate_date?: string | null
          estimate_uid?: string | null
          glide_pdf_url?: string | null
          glide_pdf_url2?: string | null
          glide_row_id?: string
          id?: string
          is_a_sample?: boolean | null
          notes?: string | null
          rowid_accounts?: string | null
          rowid_invoices?: string | null
          status?: string | null
          supabase_pdf_url?: string | null
          total_amount?: number | null
          total_credits?: number | null
          updated_at?: string | null
          valid_final_create_invoice_clicked?: boolean | null
        }
        Relationships: []
      }
      gl_expenses: {
        Row: {
          amount: number | null
          category: string | null
          created_at: string | null
          date: string | null
          expense_address: string | null
          expense_cash: string | null
          expense_change: string | null
          expense_list_of_items: string | null
          expense_receipt_image: string | null
          expense_supplier_name: string | null
          expense_tax: string | null
          expense_text_to_json: string | null
          expense_total: string | null
          glide_row_id: string
          id: string
          notes: string | null
          processing: boolean | null
          submitted_by: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          category?: string | null
          created_at?: string | null
          date?: string | null
          expense_address?: string | null
          expense_cash?: string | null
          expense_change?: string | null
          expense_list_of_items?: string | null
          expense_receipt_image?: string | null
          expense_supplier_name?: string | null
          expense_tax?: string | null
          expense_text_to_json?: string | null
          expense_total?: string | null
          glide_row_id: string
          id?: string
          notes?: string | null
          processing?: boolean | null
          submitted_by?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          category?: string | null
          created_at?: string | null
          date?: string | null
          expense_address?: string | null
          expense_cash?: string | null
          expense_change?: string | null
          expense_list_of_items?: string | null
          expense_receipt_image?: string | null
          expense_supplier_name?: string | null
          expense_tax?: string | null
          expense_text_to_json?: string | null
          expense_total?: string | null
          glide_row_id?: string
          id?: string
          notes?: string | null
          processing?: boolean | null
          submitted_by?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      gl_invoice_lines: {
        Row: {
          created_at: string | null
          date_of_sale: string | null
          glide_row_id: string
          id: string
          line_total: number | null
          product_name_display: string | null
          product_sale_note: string | null
          qty_sold: number | null
          renamed_product_name: string | null
          rowid_invoices: string | null
          rowid_products: string | null
          selling_price: number | null
          updated_at: string | null
          user_email_of_added: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_sale?: string | null
          glide_row_id: string
          id?: string
          line_total?: number | null
          product_name_display?: string | null
          product_sale_note?: string | null
          qty_sold?: number | null
          renamed_product_name?: string | null
          rowid_invoices?: string | null
          rowid_products?: string | null
          selling_price?: number | null
          updated_at?: string | null
          user_email_of_added?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_sale?: string | null
          glide_row_id?: string
          id?: string
          line_total?: number | null
          product_name_display?: string | null
          product_sale_note?: string | null
          qty_sold?: number | null
          renamed_product_name?: string | null
          rowid_invoices?: string | null
          rowid_products?: string | null
          selling_price?: number | null
          updated_at?: string | null
          user_email_of_added?: string | null
        }
        Relationships: []
      }
      gl_invoices: {
        Row: {
          balance: number | null
          created_at: string | null
          created_timestamp: string | null
          doc_glideforeverlink: string | null
          glide_row_id: string
          id: string
          invoice_order_date: string | null
          invoice_uid: string | null
          notes: string | null
          payment_status: string | null
          processed: string | null
          rowid_accounts: string | null
          submitted_timestamp: string | null
          supabase_pdf_url: string | null
          total_amount: number | null
          total_paid: number | null
          updated_at: string | null
          user_email: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          created_timestamp?: string | null
          doc_glideforeverlink?: string | null
          glide_row_id: string
          id?: string
          invoice_order_date?: string | null
          invoice_uid?: string | null
          notes?: string | null
          payment_status?: string | null
          processed?: string | null
          rowid_accounts?: string | null
          submitted_timestamp?: string | null
          supabase_pdf_url?: string | null
          total_amount?: number | null
          total_paid?: number | null
          updated_at?: string | null
          user_email?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          created_timestamp?: string | null
          doc_glideforeverlink?: string | null
          glide_row_id?: string
          id?: string
          invoice_order_date?: string | null
          invoice_uid?: string | null
          notes?: string | null
          payment_status?: string | null
          processed?: string | null
          rowid_accounts?: string | null
          submitted_timestamp?: string | null
          supabase_pdf_url?: string | null
          total_amount?: number | null
          total_paid?: number | null
          updated_at?: string | null
          user_email?: string | null
        }
        Relationships: []
      }
      gl_mappings: {
        Row: {
          column_mappings: Json
          connection_id: string
          created_at: string | null
          enabled: boolean
          glide_table: string
          glide_table_display_name: string
          id: string
          supabase_table: string
          sync_direction: string
          updated_at: string | null
        }
        Insert: {
          column_mappings?: Json
          connection_id: string
          created_at?: string | null
          enabled?: boolean
          glide_table: string
          glide_table_display_name: string
          id?: string
          supabase_table: string
          sync_direction?: string
          updated_at?: string | null
        }
        Update: {
          column_mappings?: Json
          connection_id?: string
          created_at?: string | null
          enabled?: boolean
          glide_table?: string
          glide_table_display_name?: string
          id?: string
          supabase_table?: string
          sync_direction?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gl_mappings_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "gl_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      gl_products: {
        Row: {
          category: string | null
          cost: number | null
          created_at: string | null
          date_timestamp_subm: string | null
          display_name: string | null
          email_email_of_user_who_added_product: string | null
          fronted: boolean | null
          glide_row_id: string
          id: string
          miscellaneous_items: boolean | null
          new_product_name: string | null
          po_po_date: string | null
          po_poui_dfrom_add_prod: string | null
          product_image1: string | null
          product_purchase_date: string | null
          purchase_notes: string | null
          rowid_accounts: string | null
          rowid_purchase_orders: string | null
          rowid_vendor_payments: string | null
          samples: boolean | null
          samples_or_fronted: boolean | null
          terms_for_fronted_product: string | null
          total_cost: number | null
          total_qty_purchased: number | null
          total_units_behind_sample: number | null
          updated_at: string | null
          vendor_product_name: string | null
        }
        Insert: {
          category?: string | null
          cost?: number | null
          created_at?: string | null
          date_timestamp_subm?: string | null
          display_name?: string | null
          email_email_of_user_who_added_product?: string | null
          fronted?: boolean | null
          glide_row_id: string
          id?: string
          miscellaneous_items?: boolean | null
          new_product_name?: string | null
          po_po_date?: string | null
          po_poui_dfrom_add_prod?: string | null
          product_image1?: string | null
          product_purchase_date?: string | null
          purchase_notes?: string | null
          rowid_accounts?: string | null
          rowid_purchase_orders?: string | null
          rowid_vendor_payments?: string | null
          samples?: boolean | null
          samples_or_fronted?: boolean | null
          terms_for_fronted_product?: string | null
          total_cost?: number | null
          total_qty_purchased?: number | null
          total_units_behind_sample?: number | null
          updated_at?: string | null
          vendor_product_name?: string | null
        }
        Update: {
          category?: string | null
          cost?: number | null
          created_at?: string | null
          date_timestamp_subm?: string | null
          display_name?: string | null
          email_email_of_user_who_added_product?: string | null
          fronted?: boolean | null
          glide_row_id?: string
          id?: string
          miscellaneous_items?: boolean | null
          new_product_name?: string | null
          po_po_date?: string | null
          po_poui_dfrom_add_prod?: string | null
          product_image1?: string | null
          product_purchase_date?: string | null
          purchase_notes?: string | null
          rowid_accounts?: string | null
          rowid_purchase_orders?: string | null
          rowid_vendor_payments?: string | null
          samples?: boolean | null
          samples_or_fronted?: boolean | null
          terms_for_fronted_product?: string | null
          total_cost?: number | null
          total_qty_purchased?: number | null
          total_units_behind_sample?: number | null
          updated_at?: string | null
          vendor_product_name?: string | null
        }
        Relationships: []
      }
      gl_purchase_orders: {
        Row: {
          balance: number | null
          created_at: string | null
          date_payment_date_mddyyyy: string | null
          docs_shortlink: string | null
          glide_row_id: string
          id: string
          payment_status: string | null
          pdf_link: string | null
          po_date: string | null
          product_count: number | null
          purchase_order_uid: string | null
          rowid_accounts: string | null
          supabase_pdf_url: string | null
          total_amount: number | null
          total_paid: number | null
          updated_at: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          date_payment_date_mddyyyy?: string | null
          docs_shortlink?: string | null
          glide_row_id: string
          id?: string
          payment_status?: string | null
          pdf_link?: string | null
          po_date?: string | null
          product_count?: number | null
          purchase_order_uid?: string | null
          rowid_accounts?: string | null
          supabase_pdf_url?: string | null
          total_amount?: number | null
          total_paid?: number | null
          updated_at?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          date_payment_date_mddyyyy?: string | null
          docs_shortlink?: string | null
          glide_row_id?: string
          id?: string
          payment_status?: string | null
          pdf_link?: string | null
          po_date?: string | null
          product_count?: number | null
          purchase_order_uid?: string | null
          rowid_accounts?: string | null
          supabase_pdf_url?: string | null
          total_amount?: number | null
          total_paid?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      gl_relationship_mappings: {
        Row: {
          created_at: string | null
          id: string
          relationship_type: string
          source_column: string
          source_table: string
          target_column: string
          target_table: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          relationship_type: string
          source_column: string
          source_table: string
          target_column: string
          target_table: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          relationship_type?: string
          source_column?: string
          source_table?: string
          target_column?: string
          target_table?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gl_shipping_records: {
        Row: {
          box_sizes: string | null
          box_weight: number | null
          created_at: string | null
          drop_off_location_uid: string | null
          glide_row_id: string
          id: string
          receiver_receiver_address: string | null
          receiver_receiver_name: string | null
          receiver_state: string | null
          rowid_accounts: string | null
          rowid_invoices: string | null
          sender_sender_address: string | null
          sender_sender_name_company: string | null
          sender_sender_phone: string | null
          ship_date: string | null
          tp_id: string | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          box_sizes?: string | null
          box_weight?: number | null
          created_at?: string | null
          drop_off_location_uid?: string | null
          glide_row_id: string
          id?: string
          receiver_receiver_address?: string | null
          receiver_receiver_name?: string | null
          receiver_state?: string | null
          rowid_accounts?: string | null
          rowid_invoices?: string | null
          sender_sender_address?: string | null
          sender_sender_name_company?: string | null
          sender_sender_phone?: string | null
          ship_date?: string | null
          tp_id?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          box_sizes?: string | null
          box_weight?: number | null
          created_at?: string | null
          drop_off_location_uid?: string | null
          glide_row_id?: string
          id?: string
          receiver_receiver_address?: string | null
          receiver_receiver_name?: string | null
          receiver_state?: string | null
          rowid_accounts?: string | null
          rowid_invoices?: string | null
          sender_sender_address?: string | null
          sender_sender_name_company?: string | null
          sender_sender_phone?: string | null
          ship_date?: string | null
          tp_id?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      gl_sync_errors: {
        Row: {
          created_at: string | null
          error_message: string
          error_type: string
          id: string
          mapping_id: string | null
          record_data: Json | null
          resolution_notes: string | null
          resolved_at: string | null
          retryable: boolean | null
        }
        Insert: {
          created_at?: string | null
          error_message: string
          error_type: string
          id?: string
          mapping_id?: string | null
          record_data?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          retryable?: boolean | null
        }
        Update: {
          created_at?: string | null
          error_message?: string
          error_type?: string
          id?: string
          mapping_id?: string | null
          record_data?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          retryable?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "gl_sync_errors_mapping_id_fkey"
            columns: ["mapping_id"]
            isOneToOne: false
            referencedRelation: "gl_mapping_status"
            referencedColumns: ["mapping_id"]
          },
          {
            foreignKeyName: "gl_sync_errors_mapping_id_fkey"
            columns: ["mapping_id"]
            isOneToOne: false
            referencedRelation: "gl_mappings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gl_sync_errors_mapping_id_fkey"
            columns: ["mapping_id"]
            isOneToOne: false
            referencedRelation: "gl_product_sync_stats"
            referencedColumns: ["mapping_id"]
          },
        ]
      }
      gl_sync_logs: {
        Row: {
          completed_at: string | null
          id: string
          mapping_id: string | null
          message: string | null
          records_processed: number | null
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          mapping_id?: string | null
          message?: string | null
          records_processed?: number | null
          started_at?: string | null
          status: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          mapping_id?: string | null
          message?: string | null
          records_processed?: number | null
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      gl_vendor_payments: {
        Row: {
          created_at: string | null
          date_of_payment: string | null
          date_of_purchase_order: string | null
          glide_row_id: string
          id: string
          payment_amount: number | null
          rowid_accounts: string | null
          rowid_products: string | null
          rowid_purchase_orders: string | null
          updated_at: string | null
          vendor_purchase_note: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_payment?: string | null
          date_of_purchase_order?: string | null
          glide_row_id: string
          id?: string
          payment_amount?: number | null
          rowid_accounts?: string | null
          rowid_products?: string | null
          rowid_purchase_orders?: string | null
          updated_at?: string | null
          vendor_purchase_note?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_payment?: string | null
          date_of_purchase_order?: string | null
          glide_row_id?: string
          id?: string
          payment_amount?: number | null
          rowid_accounts?: string | null
          rowid_products?: string | null
          rowid_purchase_orders?: string | null
          updated_at?: string | null
          vendor_purchase_note?: string | null
        }
        Relationships: []
      }
      pdf_generation_failures: {
        Row: {
          created_at: string
          document_id: string
          document_type: string
          error_message: string | null
          first_attempt: string
          id: number
          last_attempt: string
          next_attempt: string
          requires_manual_intervention: boolean
          resolved: boolean
          retry_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_id: string
          document_type: string
          error_message?: string | null
          first_attempt?: string
          id?: number
          last_attempt?: string
          next_attempt?: string
          requires_manual_intervention?: boolean
          resolved?: boolean
          retry_count?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_id?: string
          document_type?: string
          error_message?: string | null
          first_attempt?: string
          id?: number
          last_attempt?: string
          next_attempt?: string
          requires_manual_intervention?: boolean
          resolved?: boolean
          retry_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      pdf_generation_logs: {
        Row: {
          created_at: string
          document_id: string
          document_type: string
          error_message: string | null
          id: number
          success: boolean | null
          trigger_source: string
          trigger_type: string
        }
        Insert: {
          created_at?: string
          document_id: string
          document_type: string
          error_message?: string | null
          id?: number
          success?: boolean | null
          trigger_source: string
          trigger_type: string
        }
        Update: {
          created_at?: string
          document_id?: string
          document_type?: string
          error_message?: string | null
          id?: number
          success?: boolean | null
          trigger_source?: string
          trigger_type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      unified_audit_logs: {
        Row: {
          chat_id: number | null
          correlation_id: string | null
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          event_timestamp: string
          event_type: string
          id: string
          message_id: string | null
          metadata: Json | null
          new_state: Json | null
          previous_state: Json | null
          telegram_message_id: number | null
        }
        Insert: {
          chat_id?: number | null
          correlation_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          event_timestamp?: string
          event_type: string
          id?: string
          message_id?: string | null
          metadata?: Json | null
          new_state?: Json | null
          previous_state?: Json | null
          telegram_message_id?: number | null
        }
        Update: {
          chat_id?: number | null
          correlation_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          event_timestamp?: string
          event_type?: string
          id?: string
          message_id?: string | null
          metadata?: Json | null
          new_state?: Json | null
          previous_state?: Json | null
          telegram_message_id?: number | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          correlation_id: string | null
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
          status: string
        }
        Insert: {
          correlation_id?: string | null
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          payload: Json
          processed_at?: string | null
          status?: string
        }
        Update: {
          correlation_id?: string | null
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      balance_sheet_view: {
        Row: {
          accounts_payable: number | null
          accounts_receivable: number | null
          balance_sheet_date: string | null
          current_ratio: number | null
          customer_payments_in_transit: number | null
          debt_ratio: number | null
          debt_to_equity_ratio: number | null
          intangible_assets: number | null
          inventory_value: number | null
          long_term_debt: number | null
          owner_contributions: number | null
          owner_withdrawals: number | null
          property_and_equipment: number | null
          retained_earnings: number | null
          total_assets: number | null
          total_current_assets: number | null
          total_current_liabilities: number | null
          total_equity: number | null
          total_liabilities: number | null
          total_liabilities_and_equity: number | null
          total_non_current_assets: number | null
          total_non_current_liabilities: number | null
          unpaid_purchase_orders: number | null
          working_capital: number | null
        }
        Relationships: []
      }
      budget_variance_analysis_view: {
        Row: {
          budget_amount: number | null
          comparison_period_end: string | null
          comparison_period_start: string | null
          current_amount: number | null
          current_period_end: string | null
          current_period_start: string | null
          metric: string | null
          performance: string | null
          variance_amount: number | null
          variance_percent: number | null
        }
        Relationships: []
      }
      cash_flow_statement_view: {
        Row: {
          beginning_cash_balance: number | null
          change_in_accounts_payable: number | null
          change_in_accounts_receivable: number | null
          change_in_inventory: number | null
          customer_payments_received: number | null
          end_date: string | null
          ending_cash_balance: number | null
          expenses_paid: number | null
          loan_proceeds: number | null
          loan_repayments: number | null
          net_cash_from_financing_activities: number | null
          net_cash_from_investing_activities: number | null
          net_cash_from_operating_activities: number | null
          net_change_in_cash: number | null
          owner_contributions: number | null
          owner_withdrawals: number | null
          purchase_of_equipment: number | null
          sale_of_investments: number | null
          start_date: string | null
          vendor_payments_made: number | null
        }
        Relationships: []
      }
      financial_ratios_view: {
        Row: {
          accounts_receivable_turnover: number | null
          current_accounts_payable: number | null
          current_accounts_receivable: number | null
          current_assets: number | null
          current_inventory: number | null
          current_liabilities: number | null
          current_period_cogs: number | null
          current_period_expenses: number | null
          current_period_gross_profit: number | null
          current_period_net_profit: number | null
          current_period_revenue: number | null
          current_ratio: number | null
          gross_profit_growth_pct: number | null
          gross_profit_margin_pct: number | null
          inventory_turnover: number | null
          net_profit_growth_pct: number | null
          net_profit_margin_pct: number | null
          period_end_date: string | null
          period_start_date: string | null
          previous_period_cogs: number | null
          previous_period_expenses: number | null
          previous_period_gross_profit: number | null
          previous_period_net_profit: number | null
          previous_period_revenue: number | null
          quick_ratio: number | null
          revenue_growth_pct: number | null
        }
        Relationships: []
      }
      gl_mapping_status: {
        Row: {
          app_name: string | null
          connection_id: string | null
          current_status: string | null
          enabled: boolean | null
          error_count: number | null
          glide_table: string | null
          glide_table_display_name: string | null
          last_sync_completed_at: string | null
          last_sync_started_at: string | null
          mapping_id: string | null
          records_processed: number | null
          supabase_table: string | null
          sync_direction: string | null
          total_syncs: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gl_mappings_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "gl_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      gl_order_fulfillment: {
        Row: {
          customer_name: string | null
          has_shipping: boolean | null
          invoice_amount: number | null
          invoice_id: string | null
          invoice_rowid: string | null
          payment_status: string | null
          products: string | null
          ship_date: string | null
          total_items: number | null
          tracking_number: string | null
        }
        Relationships: []
      }
      gl_product_sync_stats: {
        Row: {
          app_name: string | null
          connection_id: string | null
          error_count: number | null
          glide_table: string | null
          glide_table_display_name: string | null
          last_sync_time: string | null
          mapping_id: string | null
          supabase_table: string | null
          sync_direction: string | null
          total_products: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gl_mappings_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "gl_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      gl_recent_logs: {
        Row: {
          app_name: string | null
          glide_table: string | null
          glide_table_display_name: string | null
          id: string | null
          mapping_id: string | null
          message: string | null
          records_processed: number | null
          started_at: string | null
          status: string | null
          supabase_table: string | null
          sync_direction: string | null
        }
        Relationships: []
      }
      gl_sync_stats: {
        Row: {
          failed_syncs: number | null
          successful_syncs: number | null
          sync_date: string | null
          syncs: number | null
          total_records_processed: number | null
        }
        Relationships: []
      }
      gl_tables_view: {
        Row: {
          table_name: unknown | null
        }
        Relationships: []
      }
      gl_unpaid_inventory: {
        Row: {
          category: string | null
          cost: number | null
          created_at: string | null
          date_timestamp_subm: string | null
          display_name: string | null
          email_email_of_user_who_added_product: string | null
          fronted: boolean | null
          glide_row_id: string | null
          id: string | null
          miscellaneous_items: boolean | null
          new_product_name: string | null
          po_po_date: string | null
          po_poui_dfrom_add_prod: string | null
          product_image1: string | null
          product_purchase_date: string | null
          purchase_notes: string | null
          rowid_accounts: string | null
          rowid_purchase_orders: string | null
          rowid_vendor_payments: string | null
          samples: boolean | null
          samples_or_fronted: boolean | null
          terms_for_fronted_product: string | null
          total_qty_purchased: number | null
          total_units_behind_sample: number | null
          unpaid_type: string | null
          unpaid_value: number | null
          updated_at: string | null
          vendor_name: string | null
          vendor_product_name: string | null
        }
        Relationships: []
      }
      mv_invoice_customer_details: {
        Row: {
          balance: number | null
          created_at: string | null
          created_timestamp: string | null
          customer: Json | null
          customer_id: string | null
          customer_name: string | null
          customer_uid: string | null
          doc_glideforeverlink: string | null
          glide_row_id: string | null
          id: string | null
          invoice_order_date: string | null
          line_item_count: number | null
          line_items_total: number | null
          notes: string | null
          payment_status: string | null
          payments_total: number | null
          rowid_accounts: string | null
          submitted_timestamp: string | null
          total_amount: number | null
          total_paid: number | null
          updated_at: string | null
          user_email: string | null
        }
        Relationships: []
      }
      mv_product_vendor_details: {
        Row: {
          category: string | null
          cost: number | null
          created_at: string | null
          date_timestamp_subm: string | null
          display_name: string | null
          email_email_of_user_who_added_product: string | null
          fronted: boolean | null
          glide_row_id: string | null
          id: string | null
          miscellaneous_items: boolean | null
          new_product_name: string | null
          po_date: string | null
          po_number: string | null
          po_po_date: string | null
          po_poui_dfrom_add_prod: string | null
          po_status: string | null
          product_image1: string | null
          product_purchase_date: string | null
          purchase_notes: string | null
          rowid_accounts: string | null
          rowid_purchase_orders: string | null
          rowid_vendor_payments: string | null
          samples: boolean | null
          samples_or_fronted: boolean | null
          terms_for_fronted_product: string | null
          total_qty_purchased: number | null
          total_units_behind_sample: number | null
          updated_at: string | null
          vendor: Json | null
          vendor_glide_id: string | null
          vendor_id: string | null
          vendor_name: string | null
          vendor_product_name: string | null
          vendor_uid: string | null
        }
        Relationships: []
      }
      mv_purchase_order_vendor_details: {
        Row: {
          balance: number | null
          created_at: string | null
          date_payment_date_mddyyyy: string | null
          docs_shortlink: string | null
          glide_row_id: string | null
          id: string | null
          payment_status: string | null
          payments_total: number | null
          pdf_link: string | null
          po_date: string | null
          product_count: number | null
          product_count_calc: number | null
          products_total: number | null
          purchase_order_uid: string | null
          rowid_accounts: string | null
          total_amount: number | null
          total_paid: number | null
          updated_at: string | null
          vendor: Json | null
          vendor_id: string | null
          vendor_name: string | null
          vendor_uid: string | null
        }
        Relationships: []
      }
      profitability_analysis_view: {
        Row: {
          analysis_type: string | null
          current_receivable_balance: number | null
          entity_category: string | null
          entity_id: string | null
          entity_name: string | null
          gross_profit: number | null
          gross_profit_margin_pct: number | null
          invoice_count: string | null
          product_count: string | null
          total_cost: number | null
          total_quantity_sold: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
      scheduled_processing_stats: {
        Row: {
          error_count: number | null
          event_type: string | null
          last_run: string | null
          recent_metadata: Json[] | null
          total_runs: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      backfill_all_vendor_balances: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      backfill_main_account_balances: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_customer_balance_for_account: {
        Args: { p_glide_row_id: string }
        Returns: number
      }
      calculate_vendor_balance_for_account: {
        Args: { p_glide_row_id: string }
        Returns: number
      }
      debug_media_message_errors: {
        Args: { p_correlation_id?: string }
        Returns: {
          error_message: string
          event_timestamp: string
          metadata: Json
          telegram_message_id: number
          chat_id: number
          correlation_id: string
        }[]
      }
      extract_forward_info: {
        Args: { message: Json }
        Returns: Json
      }
      force_resync_media_group: {
        Args: { p_media_group_id: string }
        Returns: Json
      }
      generate_invoice_uid: {
        Args: { account_uid: string; invoice_date: string }
        Returns: string
      }
      generate_po_uid: {
        Args: { account_uid: string; po_date: string }
        Returns: string
      }
      get_manual_intervention_failures: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          document_id: string
          document_type: string
          error_message: string | null
          first_attempt: string
          id: number
          last_attempt: string
          next_attempt: string
          requires_manual_intervention: boolean
          resolved: boolean
          retry_count: number
          updated_at: string
        }[]
      }
      get_pdf_coverage_stats: {
        Args: { p_table_name: string; p_document_type: string }
        Returns: Json
      }
      get_public_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
        }[]
      }
      get_supabase_function_url: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_table_columns: {
        Args: { table_name: string }
        Returns: {
          column_name: string
          data_type: string
        }[]
      }
      gl_admin_execute_sql: {
        Args: { sql_query: string }
        Returns: Json
      }
      gl_calculate_product_inventory: {
        Args: { product_id: string }
        Returns: number
      }
      gl_get_account_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          customer_count: number
          vendor_count: number
        }[]
      }
      gl_get_business_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_invoices: number
          total_estimates: number
          total_purchase_orders: number
          total_products: number
          total_customers: number
          total_vendors: number
          total_invoice_amount: number
          total_payments_received: number
          total_outstanding_balance: number
          total_purchase_amount: number
          total_payments_made: number
          total_purchase_balance: number
        }[]
      }
      gl_get_document_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
          total_count: number
          paid_count: number
          unpaid_count: number
          draft_count: number
          total_amount: number
          total_paid: number
          balance_amount: number
        }[]
      }
      gl_get_invoice_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          invoice_count: number
          estimate_count: number
          total_invoice_amount: number
          total_payments_received: number
          total_outstanding_balance: number
        }[]
      }
      gl_get_monthly_revenue: {
        Args: { months_back: number }
        Returns: {
          month: string
          revenue: number
          expenses: number
        }[]
      }
      gl_get_purchase_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_po_count: number
          open_po_count: number
          total_po_amount: number
          open_po_amount: number
        }[]
      }
      gl_get_purchase_order_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          po_count: number
          total_purchase_amount: number
          total_payments_made: number
          total_purchase_balance: number
        }[]
      }
      gl_get_recent_transactions: {
        Args: { days_back: number; limit_count: number }
        Returns: {
          id: string
          transaction_date: string
          description: string
          amount: number
          transaction_type: string
          entity_type: string
          entity_id: string
          account_name: string
        }[]
      }
      gl_get_sync_errors: {
        Args: {
          p_mapping_id: string
          p_limit?: number
          p_include_resolved?: boolean
        }
        Returns: {
          created_at: string | null
          error_message: string
          error_type: string
          id: string
          mapping_id: string | null
          record_data: Json | null
          resolution_notes: string | null
          resolved_at: string | null
          retryable: boolean | null
        }[]
      }
      gl_get_table_columns: {
        Args: { table_name: string }
        Returns: {
          column_name: string
          data_type: string
          is_nullable: boolean
          is_primary_key: boolean
        }[]
      }
      gl_record_sync_error: {
        Args: {
          p_mapping_id: string
          p_error_type: string
          p_error_message: string
          p_record_data?: Json
          p_retryable?: boolean
        }
        Returns: string
      }
      gl_resolve_sync_error: {
        Args: { p_error_id: string; p_resolution_notes?: string }
        Returns: boolean
      }
      gl_update_all_account_balances: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      gl_update_product_payment_status: {
        Args: { product_id: string; new_status: string }
        Returns: boolean
      }
      gl_validate_column_mapping: {
        Args: { p_mapping_id: string }
        Returns: {
          is_valid: boolean
          validation_message: string
        }[]
      }
      gl_validate_mapping_data: {
        Args: { p_mapping: Json; p_editing?: boolean }
        Returns: {
          is_valid: boolean
          validation_message: string
        }[]
      }
      glsync_cleanup_duplicate_accounts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      glsync_retry_failed_sync: {
        Args: { p_mapping_id: string }
        Returns: string
      }
      handle_media_message: {
        Args: {
          p_telegram_message_id: number
          p_chat_id: number
          p_file_unique_id: string
          p_media_data: Json
        }
        Returns: string
      }
      handle_telegram_webhook_standalone: {
        Args: {
          p_message: Json
          p_correlation_id: string
          p_is_edit?: boolean
          p_is_channel_post?: boolean
          p_is_forwarded?: boolean
        }
        Returns: Json
      }
      is_customer: {
        Args: { account_type: string }
        Returns: boolean
      }
      is_vendor: {
        Args: { account_type: string }
        Returns: boolean
      }
      log_pdf_generation_failure: {
        Args: {
          p_document_type: string
          p_document_id: string
          p_error_message: string
        }
        Returns: undefined
      }
      refresh_all_materialized_views: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_materialized_view: {
        Args: { view_name: string }
        Returns: undefined
      }
      refresh_materialized_view_secure: {
        Args: { view_name: string }
        Returns: undefined
      }
      reset_pdf_generation_failure: {
        Args: { p_document_type: string; p_document_id: string }
        Returns: undefined
      }
      update_account_customer_balance: {
        Args: { p_glide_row_id: string }
        Returns: undefined
      }
      update_account_vendor_balance: {
        Args: { p_glide_row_id: string }
        Returns: undefined
      }
      update_estimate_totals: {
        Args: { estimate_id: string }
        Returns: undefined
      }
      update_invoice_totals: {
        Args: { invoice_id: string }
        Returns: undefined
      }
      update_message_download_status: {
        Args: {
          p_message_id: string
          p_status: string
          p_needs_redownload?: boolean
          p_error_message?: string
          p_storage_path?: string
          p_public_url?: string
          p_storage_exists?: boolean
          p_mime_type_verified?: boolean
        }
        Returns: boolean
      }
      update_po_totals: {
        Args: { po_id: string }
        Returns: undefined
      }
    }
    Enums: {
      account_type: "Customer" | "Vendor" | "Customer & Vendor"
      message_processing_state:
        | "pending"
        | "extracting"
        | "parsing"
        | "syncing"
        | "completed"
        | "error"
      processing_state_type:
        | "initialized"
        | "pending"
        | "processing"
        | "completed"
        | "error"
        | "no_caption"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["Customer", "Vendor", "Customer & Vendor"],
      message_processing_state: [
        "pending",
        "extracting",
        "parsing",
        "syncing",
        "completed",
        "error",
      ],
      processing_state_type: [
        "initialized",
        "pending",
        "processing",
        "completed",
        "error",
        "no_caption",
      ],
    },
  },
} as const
