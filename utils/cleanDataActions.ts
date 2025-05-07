/**
 * Clean Data Actions
 * Purpose: Handles data cleaning operations and action management
 * Used in: Data cleaning, action history, error recovery
 * Features:
 * - Data cleaning execution
 * - Action deletion
 * - Bulk action management
 * - Error handling
 * - Authentication integration
 */

"use server"
import { axiosPrivate } from '@/services/axios';
import { cookies } from "next/headers";
import { AxiosError } from 'axios';

/**
 * Interface for error responses
 */
interface ErrorResponse {
    message?: string;
}

/**
 * Cleans data for a specific file
 * @param fileId - ID of the file to clean
 * @param chat - Optional chat message for the cleaning operation
 * @returns Promise resolving to cleaning operation result
 */
export const CleanData = async(fileId: string, chat:string | null) => {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try {
        const { status, data } = await axiosPrivate.post(
            "/cleandata",
            { fileId, chat },
            {
                headers: {
                    Authorization: `Bearer ${accessTokenCookie}`,
                },
            }
        );

        if (data.status === true) {
            return { success: true, data };
        } else {
            console.error("Error detected in response:", data.message);
            return { success: false, status, message: data.message || "Unknown error occurred" };
        }
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const { response } = error as AxiosError<ErrorResponse>;

            if (response) {
                const { status, data } = response;

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

                console.error("Unhandled status:", status, "Message:", data?.message);
                return { success: false, message: data?.message || "An unexpected error occurred." };
            } else if (error.request) {
                console.error("No response from server. Possible network error.");
                return { success: false, message: "No response from server. Please check your network." };
            }
        }

        console.error("Error in request setup:", (error as Error).message);
        return { success: false, message: (error as Error).message || "Request setup failed." };
    }
}

/**
 * Deletes a specific action
 * @param fileId - ID of the file associated with the action
 * @param actionId - ID of the action to delete
 * @returns Promise resolving to deletion result
 */
export const DeleteAction = async (fileId:string, actionId:string) => {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try {
        const {data} = await axiosPrivate.delete(`/deleteaction?fileId=${fileId}&actionId=${actionId}`,{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
            },
        });
        
        return {data};
    } catch(error) {
        if(error) {
            console.log(error);
        }
    }
}

/**
 * Deletes all actions for a specific file
 * @param fileId - ID of the file to delete all actions for
 * @returns Promise resolving to deletion result
 */
export const DeleteAllAction = async (fileId:string) => {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try {
        const {data} = await axiosPrivate.delete(`/deleteallaction?fileId=${fileId}`,{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
            },
        });
        
        return {data};
    } catch(error) {
        if(error) {
            console.log(error);
        }
    }
}