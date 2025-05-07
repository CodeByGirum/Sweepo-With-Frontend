/**
 * Header Layout Component
 * Purpose: Provides a layout wrapper that includes header and footer components
 * Used in: All pages that require navigation and footer elements
 * Features:
 * - Conditional header/footer rendering
 * - Authentication page handling
 * - Route-based layout management
 * - Responsive layout structure
 */

'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TransitionProvider } from '@/components/transition-provider'

/**
 * With Header Layout Component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @returns {JSX.Element} The layout structure with conditional header and footer
 * 
 * @description
 * Manages the layout structure for pages that require navigation:
 * - Checks current route to determine if header/footer should be shown
 * - Excludes header/footer from authentication pages
 * - Maintains consistent layout across non-auth pages
 * - Wraps content in semantic main element
 * 
 * Route Handling:
 * - Detects authentication routes (/login, /register)
 * - Conditionally renders header and footer
 * - Preserves layout consistency
 */
export default function WithHeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get current pathname for route-based rendering
  const pathname = usePathname();
  
  // Check if current page is an auth page
  const isAuthPage = pathname.includes('/login') || pathname.includes('/register');
  
  return (
    <TransitionProvider>
      <div className="min-h-screen">
        {/* Conditionally render header for non-auth pages */}
        {!isAuthPage && <Header/>}
        
        {/* Main content wrapper */}
        <main>
          {children}
        </main>
        
        {/* Conditionally render footer for non-auth pages */}
        {!isAuthPage && <Footer/>}
      </div>
    </TransitionProvider>
  );
}
