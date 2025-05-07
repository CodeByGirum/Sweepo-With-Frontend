/**
 * Axios Service Configuration
 * Purpose: Provides configured axios instances for API communication
 * Used in: All API requests throughout the application
 * Features:
 * - Base URL configuration
 * - Default headers
 * - Credential handling
 * - Public and private instances
 */

import axios from "axios";

// Base URL from environment variables
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Default axios instance for public API requests
 */
export default axios.create({
    baseURL: BASE_URL,
});

/**
 * Private axios instance for authenticated API requests
 * - Includes default JSON content type
 * - Enables credentials for cross-origin requests
 */
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});