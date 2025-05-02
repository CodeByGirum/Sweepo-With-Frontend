/**
 * Root Layout Component
 * Purpose: Provides the base layout structure for the entire application
 * Used in: All pages as the root layout wrapper
 * Features:
 * - Global context provider integration
 * - Page transitions
 * - Font configuration
 * - Metadata management
 * - Document structure
 */

import "./globals.css";
import ContextAPI from "@/context/context";
import type { Metadata } from "next";
import { TransitionProvider } from "@/components/transition-provider";
import { Inter } from 'next/font/google';

// Import the LoadingProvider
import { LoadingProvider } from "@/components/LoadingProvider";

/**
 * Font Configuration
 * Initializes the Inter font with Latin subset for optimal performance
 */
const inter = Inter({ subsets: ["latin"] });

/**
 * Metadata Configuration
 * @type {Metadata}
 * Defines the application's metadata for SEO and browser display
 * - Title: Application name and purpose
 * - Description: Brief explanation of functionality
 * - Icons: SVG and PNG fallback for various devices and contexts
 */
export const metadata: Metadata = {
  title: "Sweepo | Clean your data",
  description: "Explore a wide range of Data cleaning methods.",
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png' }
    ]
  }
};

/**
 * Root Layout Component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @returns {JSX.Element} The root layout structure
 * 
 * @description
 * Provides the foundational layout for the entire application:
 * - Sets HTML language and metadata
 * - Configures favicon and alternate icons
 * - Applies global font styles
 * - Wraps content in transition and context providers
 * - Structures the main content area
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/logo.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <LoadingProvider>
          <TransitionProvider>
            <ContextAPI>
              <main>
                {children}
              </main>
            </ContextAPI>
          </TransitionProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
