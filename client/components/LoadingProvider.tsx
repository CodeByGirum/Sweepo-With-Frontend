/**
 * LoadingProvider Component
 * 
 * Purpose: 
 * Provides a global loading state context for the application.
 * Enables components throughout the app to trigger and respond to loading states.
 * 
 * Used in:
 * - Application root layout
 * - Navigation transitions
 * - API data fetching operations
 * - Form submissions
 * 
 * Features:
 * - Global loading state management
 * - Context API for component access
 * - Methods to show/hide loading indicator
 * - Automatic loading handling during navigation
 * - Page transition loading effects
 */

'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Loading from './Loading';

/**
 * Type definition for LoadingContext
 * Defines the shape of the context with loading state and control methods
 */
type LoadingContextType = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

/**
 * Default context values
 * Placeholder functions for initialization
 */
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
});

/**
 * Hook to access the loading context from any component
 * @returns {LoadingContextType} The loading context with state and methods
 */
export const useLoading = () => useContext(LoadingContext);

/**
 * LoadingProvider component
 * Wraps the application and provides loading state management
 * Automatically shows loading indicator during navigation events
 * 
 * @param {object} props - Component props
 * @param {ReactNode} props.children - Child components that will have access to loading context
 * @returns {JSX.Element} Provider component with loading state
 */
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Set up event listeners for page navigation
   * Shows loading indicator when navigation starts
   * Hides loading indicator when navigation completes
   */
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Add event listeners for route changes
    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleComplete);

    // Clean up event listeners when component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleComplete);
    };
  }, [router]);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {/* Display loading overlay when isLoading is true */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#121212] bg-opacity-80">
          <Loading />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
}