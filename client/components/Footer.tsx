/**
 * Footer Component
 * Purpose: Displays site footer with copyright and links
 * Used in: All pages
 * Features:
 * - Dynamic copyright year
 * - Legal links
 * - Responsive design
 */

'use client';

import Link from "next/link"

/**
 * Footer component with copyright and legal links
 * - Automatically updates copyright year
 * - Includes terms and privacy policy links
 */
const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[#1e1e1e] py-2 px-8">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-xs text-gray-600">© {currentYear} Sweepo. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer