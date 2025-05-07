/**
 * Favorite Actions
 * Purpose: Handles favorite status toggling for files
 * Used in: Project cards, project list items
 * Features:
 * - Toggle favorite status
 * - Server-side action
 * - Error handling
 * - Authentication integration
 */

'use server';

import { axiosPrivate } from '@/services/axios';
import { cookies } from "next/headers";

/**
 * Toggles the favorite status of a file
 * @param fileId - The ID of the file to toggle favorite status for
 * @returns Promise resolving to an object containing success status and message
 */
export const toggleFavoriteStatus = async (fileId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    const { data } = await axiosPrivate.post(
      "/togglefavorite",
      { fileId },
      {
        headers: {
          Authorization: `Bearer ${accessTokenCookie}`,
        },
      }
    );
    
    if (data.status === true) {
      return { success: true, message: data.message || "Favorite status updated" };
    } else {
      return { success: false, message: data.message || "Failed to update favorite status" };
    }
  } catch (error) {
    console.error("Error toggling favorite status:", error);
    return { success: false, message: "Failed to update favorite status" };
  }
}; 