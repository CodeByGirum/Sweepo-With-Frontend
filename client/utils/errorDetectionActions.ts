/**
 * Error Detection Actions
 * Purpose: Handles error detection and schema retrieval operations
 * Used in: Error detection, schema validation, issue analysis
 * Features:
 * - Schema retrieval
 * - Issue detection
 * - Error handling
 * - Authentication integration
 */

'use server'
import { cookies } from "next/headers";
import { axiosPrivate } from '@/services/axios';

/**
 * Retrieves schema for a specific file
 * @param fileId - ID of the file to get schema for
 * @returns Promise resolving to schema data
 */
export const GetSchema = async (fileId:string) => {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try{
        const {data} = await axiosPrivate.get(`/getschema?fileid=${fileId}`,{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
            },
        });
        
        return data;
    }catch(error){
        if(error){
            return {
                message: "Something went wrong. Please try again!",
            };
        }
    }
}

/**
 * Retrieves issues for a specific file
 * @param fileId - ID of the file to get issues for
 * @returns Promise resolving to issue data
 */
export const GetIssues = async (fileId:string) => {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try{
        const {data} = await axiosPrivate.get(`/getissue?fileid=${fileId}`,{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
            },
        });
        
        return data;
    }catch(error){
        if(error){
            return {
                message: "Something went wrong. Please try again!",
            };
        }
    }
}

/**
 * Retrieves sample data from a file (first 5 rows)
 * @param fileId - ID of the file to get sample data for
 * @returns Promise resolving to sample data
 */
export const GetFileSample = async (fileId:string) => {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try{
        const {data} = await axiosPrivate.get(`/getfilesample?fileid=${fileId}&rows=5`,{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
            },
        });
        
        return data;
    }catch(error){
        console.error("Error fetching file sample:", error);
        return {
            result: [],
            error: "Failed to fetch sample data"
        };
    }
}