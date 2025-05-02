/**
 * Authentication Layout Component
 * Purpose: Provides a consistent layout for authentication pages
 * Used in: Login and registration pages
 * Features:
 * - Custom metadata for auth pages
 * - Consistent styling
 * - Full viewport height
 * - Dark theme background
 */

import type { Metadata } from "next";

/**
 * Authentication Page Metadata
 * @type {Metadata}
 * Defines SEO and browser display properties for auth pages:
 * - Title: Indicates authentication context
 * - Description: Explains auth-related functionality
 */
export const metadata: Metadata = {
  title: "Sweepo | Authentication",
  description: "Sign in or register to use Sweepo's data cleaning tools.",
};

/**
 * Authentication Layout Component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @returns {JSX.Element} The authentication page layout structure
 * 
 * @description
 * Provides the layout wrapper for authentication pages:
 * - Maintains consistent dark theme
 * - Ensures full viewport height
 * - Centers authentication forms
 * - Isolates auth content from main layout
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#121212]">
      {children}
    </div>
  );
} 