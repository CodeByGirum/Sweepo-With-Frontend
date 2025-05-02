/**
 * File Actions Module
 * 
 * Purpose: 
 * Centralized module for handling all file-related operations and API interactions.
 * This module serves as the interface between the frontend and backend for file management.
 * 
 * Used in:
 * - Upload components
 * - Project management pages
 * - Data cleaning workflows
 * - Error detection and analysis features
 * 
 * Features:
 * - File upload with validation (size, type, and metadata)
 * - File retrieval with sorting options
 * - File deletion with error handling
 * - Error detection and reporting capabilities
 * - Schema definition and updates
 * - Comprehensive error handling for API interactions
 */

'use server';
import { axiosPrivate } from '@/services/axios';
import z, { ZodError } from 'zod';
import { cookies } from "next/headers";
import { AxiosError } from 'axios';
import { SchemaType } from './types';

/**
 * Response type for file upload operations
 * Defines the structure of responses from the upload endpoints
 * 
 * @property {string|null} message - Success or error message
 * @property {Record<string, string[]>} errors - Validation errors by field
 * @property {SchemaType|null} fileSchemaDefinition - Schema definition if available
 */
type UploadResponse = {
    message: string | null;
    errors?: Record<string, string[] | undefined>;
    fileSchemaDefinition?: SchemaType | null;
};

/**
 * Interface for error responses from the API
 * Used for typing error responses in catch blocks
 * 
 * @property {string} message - Error message from the server
 */
interface ErrorResponse {
    message?: string;
}

/**
 * Uploads a file with validation
 * This function handles the file upload process, including validation of file type, 
 * size, and metadata before sending to the server.
 * 
 * @param state - Current upload state for form validation
 * @param formData - Form data containing file and metadata
 * @returns Promise resolving to upload response with status and schema if successful
 */
export const UploadFile = async (state: UploadResponse, formData: FormData): Promise<UploadResponse> => {
    // Define validation schema for uploads using Zod
    const UploadValidation = z.object({
        file: z
            .instanceof(Blob, { message: "File upload is required." })
            .refine((file) => file.size > 0, "File upload cannot be empty.")
            .refine(
                (file) => ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(file.type),
                "Only CSV or Excel files are allowed."
            ),            
        category: z.string()
            .nonempty("Category is required."),
        description: z.string()
            .max(1000, "File description must not exceed 1000 characters.")
            .nonempty("File Description is required."),
    });

    // Extract values from form data
    const inputValues = {
        file: formData.get('file') as File,
        category: formData.get('category') as string,
        description: formData.get('description') as string
    };

    try{
        // Validate the input values
        UploadValidation.parse(inputValues);

        // Get the authentication token from cookies
        const cookieStore = await cookies();
        const accessTokenCookie = cookieStore.get("accessToken")?.value;

        // Send the upload request to the API
        const {data} = await axiosPrivate.post("/upload",formData,{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
                "Content-Type": "multipart/form-data",
            },
        });
    
        return {...data};
    } catch(error: unknown){
        // Handle different types of errors
        if (error instanceof AxiosError) {
            const { response } = error;
            if (response) {
                const { status, data } = response;
                // Handle different HTTP status codes
                if (status === 400) {
                    return {
                        message: "",
                        errors: { root: [data?.message || "Invalid data."] },
                    };
                } else if (status === 500) {
                    return {
                        message: "",
                        errors: { root: [data?.message || "Server error. Please try again later."] },
                    };
                } else {
                    return {
                        message: "",
                        errors: { root: [data?.message || "Something went wrong. Please try again!"] },
                    };
                }
            } else {
                return {
                    message: "",
                    errors: { root: ["No response received from the server."] },
                };
            }
        } else if (error instanceof ZodError) {
            // Return validation errors from Zod
            return {
                message: "",
                errors: error.flatten().fieldErrors,
            };
        } else {
            // Handle any other type of error
            return {
                message: "",
                errors: { root: ["Something went wrong. Please try again!"] },
            };
        }
    }
}

/**
 * Retrieves files with optional sorting
 * Fetches all files/projects for the current user with the ability to sort results.
 * If the API doesn't support sorting, client-side sorting is applied.
 * 
 * @param sortOrder - Optional sort order ('desc' or 'asc')
 * @returns Promise resolving to file data containing list of files/projects
 */
export const GetFile = async (sortOrder?: 'desc' | 'asc') => {
    // Get the authentication token from cookies
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try{
        // Prepare sort parameter for API request
        const sortParam = sortOrder ? `?sort=${sortOrder}` : '';
        
        // Fetch files/projects from the API
        const {data} = await axiosPrivate.get(`/projects${sortParam}`,{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
            },
        });
        
        // If the API doesn't support sorting, perform client-side sorting
        if (sortOrder && Array.isArray(data)) {
            data.sort((a, b) => {
                const timeA = a.timestamp_order || new Date(a.created_at || 0).getTime();
                const timeB = b.timestamp_order || new Date(b.created_at || 0).getTime();
                return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
            });
        }
        
        return {data};
    } catch(error){
        if(error){
            return {
                message: '',
                errors: { root: ["Something went wrong. Please try again!"] },
            };
        }
    }
}

/**
 * Deletes a file/project
 * Removes a file from the system based on its ID. Includes comprehensive
 * error handling for common scenarios like file not found.
 * 
 * @param fileId - ID of the file to delete
 * @returns Promise resolving to deletion response with status and message
 */
export const DeleteFile = async (fileId:string) => {
    // Validate fileId input
    if (!fileId) {
        return {
            data: {
                status: false,
                message: "File ID is required"
            }
        };
    }

    // Get the authentication token from cookies
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try{
        // Log the request for debugging
        console.log(`Attempting to delete file with ID: ${fileId}`);
        
        // Use RESTful DELETE request to remove the file
        const {data} = await axiosPrivate.delete(`/projects/${fileId}`,{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
            },
        });
        
        return {data};
    } catch(error: any) {
        // Log detailed error information for debugging
        console.error("Delete file error:", error?.response?.data || error?.message || error);
        
        // Handle 404 Not Found specifically
        if (error?.response?.status === 404) {
            return {
                data: {
                    status: false,
                    message: "File not found. It may have been already deleted or doesn't exist."
                }
            };
        }
        
        // Handle other API errors with response data
        if (error?.response?.data) {
            return {
                data: {
                    status: false,
                    message: error.response.data.message || "Server returned an error"
                }
            };
        }
        
        // Handle general errors
        return {
            data: {
                status: false,
                message: error?.message || "Something went wrong. Please try again!"
            }
        };
    }
}

/**
 * Reports and detects errors in a file
 * Analyzes a file for data quality issues and errors. Can force re-detection
 * of errors if needed (useful after data cleaning operations).
 * 
 * @param fileId - ID of the file to analyze
 * @param ReDetect - Whether to force re-detection of errors
 * @returns Promise resolving to error detection response with detailed error information
 */
export const ErrorReport = async (fileId: string, ReDetect: boolean) => {
    // Get the authentication token from cookies
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try {
        // Send error detection request to the API
        const { data } = await axiosPrivate.post(
            "/errordetection",
            { fileId, ReDetect },
            {
                headers: {
                    Authorization: `Bearer ${accessTokenCookie}`,
                },
            }
        );

        // Handle successful response
        if (data.status === true) {
            return { success: true, data };
        } else {
            // Log and return error from the API
            console.error("Error detected in response:", data.message);
            return { success: false, message: data.message || "Unknown error occurred" };
        }
    } catch (error: unknown) {
        // Handle specific HTTP error codes
        if (error instanceof AxiosError) {
            const { response } = error as AxiosError<ErrorResponse>;

            if (response) {
                const { status, data } = response;

                // Handle different HTTP status codes with specific error messages
                if (status === 400) {
                    console.error("Bad request error:", data?.message || "Invalid request parameters.");
                    return { success: false, message: data?.message || "Bad request." };
                }

                if (status === 401) {
                    console.error("Unauthorized access:", data?.message || "Invalid or expired token.");
                    return { success: false, message: data?.message || "Unauthorized access." };
                }

                if (status === 404) {
                    console.error("Resource not found:", data?.message || "File not found.");
                    return { success: false, message: data?.message || "File not found." };
                }

                if (status === 500) {
                    console.error("Internal server error:", data?.message || "An error occurred on the server.");
                    return { success: false, message: data?.message || "Internal server error." };
                }

                // Log and handle unspecified status codes
                console.error("Unhandled status:", status, "Message:", data?.message);
                return { success: false, message: data?.message || "An unexpected error occurred." };
            } else if (error.request) {
                // Handle network errors (no response received)
                console.error("No response from server. Possible network error.");
                return { success: false, message: "No response from server. Please check your network." };
            }
        }

        // Handle unexpected errors
        console.error("Error in request setup:", (error as Error).message);
        return { success: false, message: (error as Error).message || "Request setup failed." };
    }
};

/**
 * Updates a file's schema
 * Modifies the schema definition for a file, which can include changing 
 * column types, formats, and other schema-related properties.
 * 
 * @param UpdatedSchema - The updated schema to apply
 * @returns Promise resolving to schema update response
 */
export const UpdateSchema = async (UpdatedSchema:SchemaType) => {
    // Get the authentication token from cookies
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try {
        // Send schema update request to the API
        const { data } = await axiosPrivate.put(
            "/editschema",
            UpdatedSchema,
            {
                headers: {
                    Authorization: `Bearer ${accessTokenCookie}`,
                },
            }
        );

        // Handle successful response
        if (data.status === true) {
            return { ...data };
        } else {
            // Log and return error from the API
            console.error("Error detected in response:", data.message);
            return { message: data.message || "Unknown error occurred" };
        }
    } catch (error: unknown) {
        // Handle specific HTTP error codes
        if (error instanceof AxiosError) {
            const { response } = error as AxiosError<ErrorResponse>;

            if (response) {
                const { status, data } = response;

                // Handle different HTTP status codes with specific error messages
                if (status === 400) {
                    return { message: data?.message || "Bad request." };
                }

                if (status === 401) {
                    return { message: data?.message || "Unauthorized access." };
                }

                if (status === 404) {
                    return { message: data?.message || "File not found." };
                }

                if (status === 500) {
                    return { message: data?.message || "Internal server error." };
                }

                return { message: data?.message || "An unexpected error occurred." };
            }
        }

        // Handle unexpected errors
        return { message: (error as Error).message || "Request setup failed." };
    }
};

/**
 * Retrieves a file's schema
 * Fetches the current schema definition for a file, including column types,
 * formats, and other schema-related properties.
 * 
 * @param fileId - ID of the file to get schema for
 * @returns Promise resolving to schema data with column definitions
 */
export const getSchema = async (fileId:string) => {
    // Get the authentication token from cookies
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try {
        // Fetch schema from the API
        const { data } = await axiosPrivate.get(`/getschema/${fileId}`, {
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`,
            },
        });

        return { data };
    } catch (error) {
        // Handle errors
        if (error) {
            return {
                message: '',
                errors: { root: ["Something went wrong. Please try again!"] },
            };
        }
    }
};
