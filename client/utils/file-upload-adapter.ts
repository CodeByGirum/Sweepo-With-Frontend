/**
 * File Upload Adapter
 * Purpose: Provides a layer of abstraction for file upload and schema update operations
 * Used in: File upload wizard, schema management
 * Features:
 * - File upload validation and processing
 * - Schema update handling
 * - Timestamp management
 * - Error handling and response formatting
 */

'use server';

import { UploadFile, UpdateSchema } from '@/utils/fileActions';
import { SchemaType } from '@/utils/types';

/**
 * Response type for file upload operations
 */
export type UploadResponse = {
  message: string | null;
  fileSchemaDefinition?: {
    file_id: string;
    schema_definition: Record<string, any>;
    awareness: string;
    timestamp?: string;
    timestamp_order?: number;
  } | null;
  errors?: Record<string, string[]>;
};

/**
 * Uploads a project file with validation and timestamp management
 * @param formData - Form data containing file and metadata
 * @returns Promise resolving to upload response
 */
export async function uploadProjectFile(formData: FormData): Promise<UploadResponse> {
  try {
    // Validate the input before sending
    if (!formData.get('file')) {
      return {
        message: null,
        errors: { file: ["File is required"] }
      };
    }
    
    if (!formData.get('category')) {
      return {
        message: null,
        errors: { category: ["Category is required"] }
      };
    }
    
    if (!formData.get('description')) {
      return {
        message: null,
        errors: { description: ["Description is required"] }
      };
    }
    
    // Ensure date and time data is present
    const now = new Date();
    
    // Timestamp components
    if (!formData.get('upload_date')) {
      formData.append('upload_date', now.toISOString().split('T')[0]);
    }
    
    if (!formData.get('upload_time')) {
      formData.append('upload_time', now.toISOString().split('T')[1].split('.')[0]);
    }
    
    if (!formData.get('timestamp')) {
      const date = formData.get('upload_date') || now.toISOString().split('T')[0];
      const time = formData.get('upload_time') || now.toISOString().split('T')[1].split('.')[0];
      formData.append('timestamp', `${date}T${time}`);
    }
    
    if (!formData.get('timestamp_order')) {
      formData.append('timestamp_order', now.getTime().toString());
    }
    
    const result = await UploadFile({
      message: null,
      fileSchemaDefinition: { 
        file_id: "", 
        schema_definition: {}, 
        awareness: "",
        timestamp: formData.get('timestamp') as string,
        timestamp_order: parseInt(formData.get('timestamp_order') as string)
      },
      errors: {}
    }, formData);
    
    // Ensure the result matches our expected type
    const response: UploadResponse = {
      message: result.message,
      fileSchemaDefinition: result.fileSchemaDefinition ? {
        ...result.fileSchemaDefinition,
        timestamp: formData.get('timestamp') as string,
        timestamp_order: parseInt(formData.get('timestamp_order') as string)
      } : null,
      errors: result.errors ? Object.fromEntries(
        Object.entries(result.errors).map(([key, value]) => [key, value || []])
      ) : undefined
    };
    
    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    // Provide more useful error information
    if (error instanceof Error) {
      return {
        message: null,
        errors: { root: [error.message || "Error uploading file"] }
      };
    }
    return {
      message: null,
      errors: { root: ["An unexpected error occurred while uploading the file"] }
    };
  }
}

/**
 * Updates a project's schema with validation and timestamp management
 * @param schemaData - Schema data to update
 * @returns Promise resolving to update response
 */
export async function updateProjectSchema(schemaData: SchemaType) {
  try {
    // Validate schema data before sending
    if (!schemaData.file_id) {
      throw new Error("File ID is required");
    }
    
    if (!schemaData.schema_definition || Object.keys(schemaData.schema_definition).length === 0) {
      throw new Error("Schema definition is required");
    }
    
    // Ensure the schema has timestamps
    if (!schemaData.created_at) {
      schemaData.created_at = new Date().toISOString();
    }
    
    // Make sure timestamp fields are properly set
    if (!schemaData.timestamp) {
      const now = new Date();
      schemaData.timestamp = now.toISOString().replace('Z', '');
    }
    
    if (!schemaData.timestamp_order) {
      schemaData.timestamp_order = Date.now();
    }
    
    const result = await UpdateSchema(schemaData);
    return result;
  } catch (error) {
    console.error("Error updating schema:", error);
    throw error;
  }
} 