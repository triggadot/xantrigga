
import { GlColumnMapping, GlProduct, GlSyncRecord } from '@/types/glsync';

/**
 * Transform a value based on its data type
 */
export const transformValue = (
  value: any, 
  dataType: string
): any | null => {
  if (value === null || value === undefined) {
    return null;
  }

  try {
    switch (dataType) {
      case 'number':
        return typeof value === 'string' ? parseFloat(value) : value;
      
      case 'boolean':
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
          const lowerValue = value.toLowerCase();
          if (lowerValue === 'true' || lowerValue === 'yes' || lowerValue === '1') return true;
          if (lowerValue === 'false' || lowerValue === 'no' || lowerValue === '0') return false;
        }
        return Boolean(value);
      
      case 'date-time':
        if (value instanceof Date) return value.toISOString();
        if (typeof value === 'string') {
          const date = new Date(value);
          return isNaN(date.getTime()) ? null : date.toISOString();
        }
        return null;
      
      case 'string':
      case 'image-uri':
      case 'email-address':
        return String(value);
      
      default:
        return value;
    }
  } catch (error) {
    console.error(`Error transforming value ${value} to ${dataType}:`, error);
    return null;
  }
};

/**
 * Transform Glide product data to Supabase format 
 */
export const transformGlideToSupabaseProduct = (
  glideProduct: Record<string, any>,
  columnMappings: Record<string, GlColumnMapping>
): { product: GlProduct; errors: GlSyncRecord[] } => {
  const product: GlProduct = {
    glide_row_id: glideProduct.id || glideProduct.rowId || '',
  };
  
  const errors: GlSyncRecord[] = [];
  
  // Process each mapped column
  Object.entries(columnMappings).forEach(([glideColumnId, mapping]) => {
    try {
      const glideValue = glideProduct[glideColumnId];
      
      if (glideValue !== undefined) {
        const transformedValue = transformValue(glideValue, mapping.data_type);
        product[mapping.supabase_column_name as keyof GlProduct] = transformedValue;
      }
    } catch (error) {
      errors.push({
        type: 'TRANSFORM_ERROR',
        message: `Error transforming field ${mapping.glide_column_name} to ${mapping.supabase_column_name}: ${error instanceof Error ? error.message : String(error)}`,
        record: { 
          glide_column: mapping.glide_column_name, 
          value: glideProduct[glideColumnId] 
        },
        timestamp: new Date().toISOString(),
        retryable: false
      });
    }
  });

  return {
    product,
    errors
  };
};

/**
 * Validate a product record
 */
export const validateProduct = (product: GlProduct): GlSyncRecord[] => {
  const errors: GlSyncRecord[] = [];
  
  // Check required fields
  if (!product.glide_row_id) {
    errors.push({
      type: 'VALIDATION_ERROR',
      message: 'Missing required field: glide_row_id',
      record: product,
      timestamp: new Date().toISOString(),
      retryable: false
    });
  }
  
  // Validate numeric fields
  if (product.cost !== null && product.cost !== undefined) {
    if (isNaN(product.cost as number)) {
      errors.push({
        type: 'VALIDATION_ERROR',
        message: 'Invalid cost value: must be a number',
        record: { field: 'cost', value: product.cost },
        timestamp: new Date().toISOString(),
        retryable: false
      });
    }
  }
  
  if (product.total_qty_purchased !== null && product.total_qty_purchased !== undefined) {
    if (isNaN(product.total_qty_purchased as number)) {
      errors.push({
        type: 'VALIDATION_ERROR',
        message: 'Invalid total_qty_purchased value: must be a number',
        record: { field: 'total_qty_purchased', value: product.total_qty_purchased },
        timestamp: new Date().toISOString(),
        retryable: false
      });
    }
  }
  
  // Validate date fields
  const dateFields = ['po_po_date', 'product_purchase_date', 'date_timestamp_subm'];
  dateFields.forEach(field => {
    const value = product[field as keyof GlProduct];
    if (value !== null && value !== undefined) {
      const date = new Date(value as string);
      if (isNaN(date.getTime())) {
        errors.push({
          type: 'VALIDATION_ERROR',
          message: `Invalid ${field} value: must be a valid date`,
          record: { field, value },
          timestamp: new Date().toISOString(),
          retryable: false
        });
      }
    }
  });
  
  return errors;
};

export const transformColumnMappings = (columnMappings: any) => {
  if (!columnMappings) return {};
  
  return Object.entries(columnMappings).reduce((acc, [key, value]) => {
    acc[key] = {
      glideColumn: value.glideColumn || value.glide_column_name,
      supabaseColumn: value.supabaseColumn || value.supabase_column_name,
      dataType: value.dataType || value.data_type || 'text',
      direction: value.direction || 'both'
    };
    return acc;
  }, {} as Record<string, any>);
};
