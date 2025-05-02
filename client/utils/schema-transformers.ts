/**
 * Schema Transformers
 * Purpose: Provides utilities for transforming column schemas between different formats
 * Used in: File upload wizard, data processing, schema validation
 * Features:
 * - Column schema transformation
 * - Data type mapping
 * - Metadata handling
 * - Numeric sign and precision mapping
 */

import { schemaTypeDefinition } from '@/utils/types';

/**
 * Interface for column schema in wizard format
 */
type ColumnSchema = {
  name: string;
  dataType: string;
  numericSign?: string;
  precision?: string;
  uniqueness?: string;
  dateFormat?: string;
  dateSeparator?: string;
  description?: string;
};

/**
 * Transforms columns from wizard format to backend schema format
 * @param columns - Array of column schemas in wizard format
 * @param metadata - Optional metadata containing upload date/time information
 * @returns Record of column names to schema type definitions
 */
export function transformColumnsToSchema(columns: ColumnSchema[] | null | undefined, metadata?: Record<string, any>) {
  const schema: Record<string, schemaTypeDefinition> = {};
  
  // Handle null/undefined columns
  if (!columns || columns.length === 0) {
    return schema;
  }
  
  // First, add any metadata date columns for filtering
  if (metadata) {
    // Add a full timestamp column for precise sorting and filtering
    schema['timestamp'] = {
      dataType: 'DateTime',
      unique: false,
      numericSign: null,
      precision: null,
      format: 'YYYY-MM-DD HH:mm:ss',
      separator: null,
      desc: 'Full timestamp for sorting and filtering'
    };
    
    if (metadata.upload_date) {
      schema['upload_date'] = {
        dataType: 'Date',
        unique: false,
        numericSign: null,
        precision: null,
        format: 'YYYY-MM-DD',
        separator: '-',
        desc: 'File upload date for filtering'
      };
    }
    
    if (metadata.upload_time) {
      schema['upload_time'] = {
        dataType: 'Time',
        unique: false,
        numericSign: null,
        precision: null,
        format: 'HH:mm:ss',
        separator: ':',
        desc: 'File upload time for filtering and sorting'
      };
    }
    
    // Add sortable numeric timestamp for easier ordering
    schema['timestamp_order'] = {
      dataType: 'Integer',
      unique: false,
      numericSign: 'Positive',
      precision: null,
      format: null,
      separator: null,
      desc: 'Numeric timestamp for ordering files by creation time'
    };
  }
  
  // Add file columns
  columns.forEach(column => {
    if (!column.name) {
      console.warn('Column missing name property', column);
      return; // Skip this column
    }
    
    schema[column.name] = {
      dataType: mapDataType(column.dataType || 'String'),
      unique: column.uniqueness === "Unique",
      numericSign: mapNumericSign(column.numericSign),
      precision: mapPrecision(column.precision),
      format: column.dateFormat || null,
      separator: column.dateSeparator || null,
      desc: column.description || null
    };
  });
  
  return schema;
}

/**
 * Maps data types from wizard format to backend format
 * @param type - Data type in wizard format
 * @returns Corresponding data type in backend format
 */
function mapDataType(type: string) {
  const typeMap: Record<string, string> = {
    "String": "String",
    "Integer": "Integer",
    "Float": "Float",
    "Boolean": "Boolean",
    "Date": "Date",
    "DateTime": "DateTime",
    "Time": "String" // Map Time to String since we don't have a specific Time type
  };
  return typeMap[type] || "String"; // Default to String if unknown type
}

/**
 * Maps numeric sign from wizard format to backend format
 * @param sign - Numeric sign in wizard format
 * @returns Corresponding numeric sign in backend format
 */
function mapNumericSign(sign?: string) {
  if (!sign || sign === "Any") return null;
  return sign === "Positive Only" ? "Positive" : 
         sign === "Negative Only" ? "Negative" : null;
}

/**
 * Maps precision from wizard format to backend format
 * @param precision - Precision in wizard format
 * @returns Corresponding precision in backend format
 */
function mapPrecision(precision?: string) {
  if (!precision || precision === "No Limit") return null;
  const match = precision?.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
} 