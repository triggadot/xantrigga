/**
 * @function glsync_master_cleanup
 * @deprecated This function has been removed from the database. All tables now use the standard upsert pattern without special handling.
 * 
 * @description
 * [DEPRECATED] This function previously exited override mode for Glidebase sync operations by fixing 
 * inconsistent data and re-enabling all PostgreSQL constraints and triggers. It has been removed as 
 * part of the standardization to use the same upsert pattern for all tables.
 * 
 * According to the Glidebase pattern:
 * - All tables use the same standard upsert method with no special handling for specific tables
 * - Relationships use rowid_ fields referencing glide_row_id values without foreign key constraints
 * - The sync process uses standard Supabase upsert functionality with consistent configuration
 * - Data integrity is maintained through application logic, database triggers, and proper indexing
 * 
 * @migration
 * If you encounter errors related to this function, apply the migration file:
 * 20250407_fix_glsync_estimate_lines_references.sql
 * 
 * @replacementPattern
 * Instead of using this specialized function, use the standard upsert pattern:
 * ```typescript
 * // Standard upsert for all tables
 * const { error } = await supabase
 *   .from(mapping.supabase_table)
 *   .upsert(batch, { 
 *     onConflict: 'glide_row_id',
 *     ignoreDuplicates: false
 *   });
 * ```
 * 
 * @sql
 * ```sql
 * -- This function has been removed from the database
 * ```
 * 
 * @returns {void} This function doesn't return any value
 * 
 * @example
 * ```typescript
 * // Call from edge function
 * // This function has been removed. Use standard upsert pattern instead.
 * 
 * // Call from another PostgreSQL function
 * // This function has been removed. Use standard upsert pattern instead.
 * ```
 * 
 * @security
 * - SECURITY DEFINER: Runs with the privileges of the function creator
 * - This function has elevated permissions to modify PostgreSQL session settings
 * 
 * @sideEffects
 * - This function has been removed. Use standard upsert pattern instead.
 * 
 * @performance
 * - This function has been removed. Use standard upsert pattern instead.
 * 
 * @dependencies
 * - This function has been removed. Use standard upsert pattern instead.
 * 
 * @errors
 * - No specific errors are thrown by this function
 * - Database-level errors may occur if tables are missing or schema has changed
 */

/**
 * Type definition for the glsync_master_cleanup function parameters and return value
 * @deprecated This function has been removed. Use standard upsert pattern instead.
 */
export interface GlsyncMasterCleanup {
  /**
   * [DEPRECATED] This function has been removed.
   * @returns A promise that resolves to void (no return value)
   */
  (): Promise<void>;
}
