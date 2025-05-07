/**
 * File Parsers
 * Purpose: Provides utilities for parsing and analyzing uploaded files in the browser
 * Used in: File upload wizard, data preview, schema detection
 * Features:
 * - CSV file parsing
 * - Data type detection
 * - Column type analysis
 * - Date format detection
 * - Null value handling
 */

/**
 * Type definitions for parsed data
 */
export type DataRow = Record<string, any>;
export type ColumnTypes = Record<string, string>;

/**
 * Parse a CSV file and return the data as an array of objects
 * @param file - The CSV file to parse
 * @param maxRows - Optional maximum number of rows to parse
 * @returns Promise resolving to an array of data rows
 */
export async function parseCSVFile(file: File, maxRows?: number): Promise<DataRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        if (!csvText) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        // Split the file into lines
        const lines = csvText.split(/\r\n|\n/);
        if (lines.length === 0) {
          resolve([]);
          return;
        }
        
        // Parse the header row
        const headers = parseCSVRow(lines[0]);
        
        // Parse data rows
        const data: DataRow[] = [];
        const rowCount = maxRows ? Math.min(lines.length, maxRows + 1) : lines.length;
        
        for (let i = 1; i < rowCount; i++) {
          if (lines[i].trim() === '') continue;
          
          const row = parseCSVRow(lines[i]);
          const dataObject: DataRow = {};
          
          for (let j = 0; j < headers.length; j++) {
            dataObject[headers[j]] = convertToTypedValue(row[j]);
          }
          
          data.push(dataObject);
        }
        
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Parse a single CSV row, handling quoted values with commas
 * @param row - The CSV row string to parse
 * @returns Array of parsed values
 */
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let insideQuotes = false;
  let currentValue = '';
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      if (i + 1 < row.length && row[i + 1] === '"') {
        // Escaped quote
        currentValue += '"';
        i++;
      } else {
        // Toggle insideQuotes flag
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of value
      result.push(currentValue);
      currentValue = '';
    } else {
      // Add character to current value
      currentValue += char;
    }
  }
  
  // Add the last value
  result.push(currentValue);
  
  return result;
}

/**
 * Convert string values to their appropriate types
 * @param value - The string value to convert
 * @returns Converted value with appropriate type
 */
function convertToTypedValue(value: string): any {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  
  // Check for numeric values
  if (/^-?\d+$/.test(value)) {
    return parseInt(value, 10);
  }
  
  if (/^-?\d+\.\d+$/.test(value)) {
    return parseFloat(value);
  }
  
  // Check for boolean values
  if (/^true|false$/i.test(value)) {
    return value.toLowerCase() === 'true';
  }
  
  // Check for date values - enhanced date detection
  // Common date formats: MM/DD/YYYY, DD/MM/YYYY, YYYY/MM/DD, MM-DD-YYYY, DD-MM-YYYY, YYYY-MM-DD
  const dateRegexes = [
    /^\d{1,2}\/\d{1,2}\/\d{4}$/, // MM/DD/YYYY or DD/MM/YYYY
    /^\d{4}\/\d{1,2}\/\d{1,2}$/, // YYYY/MM/DD
    /^\d{1,2}-\d{1,2}-\d{4}$/, // MM-DD-YYYY or DD-MM-YYYY
    /^\d{4}-\d{1,2}-\d{1,2}$/, // YYYY-MM-DD
    /^\d{1,2}\.\d{1,2}\.\d{4}$/, // MM.DD.YYYY or DD.MM.YYYY
    /^\d{4}\.\d{1,2}\.\d{1,2}$/, // YYYY.MM.DD
  ];
  
  // Check if the value matches any date format
  const isDateFormat = dateRegexes.some(regex => regex.test(value));
  if (isDateFormat) {
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime())) {
      return value; // Return original string format for dates
    }
  }
  
  return value;
}

/**
 * Detect the likely data type of a column based on values
 * @param data - Array of data rows to analyze
 * @returns Object mapping column names to their detected types
 */
export function detectColumnTypes(data: DataRow[]): ColumnTypes {
  if (!data.length) return {};
  
  const firstRow = data[0];
  const columnTypes: ColumnTypes = {};
  
  // Initialize all columns with 'Unknown' type
  Object.keys(firstRow).forEach(colName => {
    columnTypes[colName] = 'Unknown';
  });
  
  // Analyze each column across all rows
  for (const colName of Object.keys(firstRow)) {
    let hasNumbers = false;
    let hasIntegers = true;
    let hasStrings = false;
    let hasBooleans = false;
    let hasDates = false;
    let hasNull = false;
    let totalValues = 0;
    let nullCount = 0;
    
    // Analyze the values in this column
    for (const row of data) {
      const value = row[colName];
      totalValues++;
      
      if (value === null || value === undefined || value === '') {
        hasNull = true;
        nullCount++;
        continue;
      }
      
      const type = typeof value;
      
      if (type === 'number') {
        hasNumbers = true;
        // Check if it's a float
        if (value % 1 !== 0) {
          hasIntegers = false;
        }
      } else if (type === 'string') {
        hasStrings = true;
        
        // Enhanced date detection
        const dateRegexes = [
          /^\d{1,2}\/\d{1,2}\/\d{4}$/, // MM/DD/YYYY or DD/MM/YYYY
          /^\d{4}\/\d{1,2}\/\d{1,2}$/, // YYYY/MM/DD
          /^\d{1,2}-\d{1,2}-\d{4}$/, // MM-DD-YYYY or DD-MM-YYYY
          /^\d{4}-\d{1,2}-\d{1,2}$/, // YYYY-MM-DD
          /^\d{1,2}\.\d{1,2}\.\d{4}$/, // MM.DD.YYYY or DD.MM.YYYY
          /^\d{4}\.\d{1,2}\.\d{1,2}$/, // YYYY.MM.DD
        ];
        
        // Check if the value matches any date format
        const isDateFormat = dateRegexes.some(regex => regex.test(value));
        if (isDateFormat) {
          const dateValue = new Date(value);
          if (!isNaN(dateValue.getTime())) {
            hasDates = true;
          }
        }
      } else if (type === 'boolean') {
        hasBooleans = true;
      }
    }
    
    // Determine the most likely type with improved logic
    // If more than 50% of values are null, we keep the type as 'Unknown'
    if (nullCount / totalValues > 0.5) {
      columnTypes[colName] = 'String';
    } else if (hasNumbers && !hasStrings && !hasBooleans) {
      columnTypes[colName] = hasIntegers ? 'Integer' : 'Float';
    } else if (hasBooleans && !hasNumbers && !hasStrings) {
      columnTypes[colName] = 'Boolean';
    } else if (hasDates && hasStrings && !hasNumbers && !hasBooleans) {
      columnTypes[colName] = 'Date';
    } else {
      columnTypes[colName] = 'String';
    }
  }
  
  return columnTypes;
} 