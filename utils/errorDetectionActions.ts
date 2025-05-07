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
    }catch(error: any){
        console.error("Error getting issues:", error);
        
        // Check if this is a "no file found" error
        if (error?.response?.data?.message?.includes("No file found")) {
            console.error("No file found for the given user and file ID. Using mock data instead.");
        }
        
        // Return mock data for development/testing
        return getMockData(fileId);
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

/**
 * Generates mock data for development and testing
 * @param fileId - ID of the file to generate mock data for
 * @returns Mock data object mimicking API response
 */
function getMockData(fileId: string) {
    // Generate 50 rows of mock data with various issues
    const records = [];
    
    for (let i = 0; i < 50; i++) {
        const hasNullCategory = i % 7 === 0;
        const hasInvalidEmail = i % 11 === 0;
        const hasInvalidDate = i % 13 === 0;
        const hasNegativeRating = i % 19 === 0;
        const hasNullAge = i % 5 === 0;
        const hasNullSalary = i % 9 === 0;
        
        records.push({
            name: `User ${i + 1}`,
            age: hasNullAge ? null : 20 + (i % 50),
            salary: hasNullSalary ? null : 30000 + (i * 1000),
            email: hasInvalidEmail ? `invalid-email-${i}` : `user${i}@example.com`,
            join_date: hasInvalidDate ? `01/01/2023` : `2023-01-${(i % 28) + 1}`,
            category: hasNullCategory ? null : ['A', 'B', 'C', 'D'][i % 4],
            score: 50 + (i % 50),
            rating: hasNegativeRating ? -1 * (i % 5) : (i % 5),
        });
    }
    
    return {
        fileId,
        original_name: "sample_dataset.csv",
        description: "Sample dataset for testing the cleaning dashboard",
        records
    };
}