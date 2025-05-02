/**
 * Header Component
 * Purpose: Main navigation header used across all pages
 * Reused in: All pages of the application
 * Features:
 * - Responsive design (mobile/desktop)
 * - User authentication state handling
 * - Navigation menu
 * - Logout functionality
 */

'use client';

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from 'lucide-react'
import { motion } from "framer-motion"
import { useGlobalContext } from '@/context/context';
import { useRouter } from 'next/navigation';
import { logout } from '@/utils/authActions';

interface HeaderProps {
  transparent?: boolean
}

/**
 * Main header component with responsive navigation
 * @param transparent - Optional prop to make header background transparent
 */
const Header = ({ transparent = false }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, setUser } = useGlobalContext();
  const router = useRouter();

    /**
     * Handles user logout process
     * - Calls logout API
     * - Clears user context
     * - Redirects to home page
     */
    const handleLogout = async () => {
        try {
      const result = await logout();
            
            if (result) {
                console.log("User logged out successfully");
                setUser(null); 
        setMobileMenuOpen(false);
        router.push("/");
            }
        } catch (error) {
            console.log(error);
            console.error("Error during logout:", error);
        }
    };

    return (
    <header
      className={`px-8 py-4 flex justify-between items-center ${
        transparent ? "bg-transparent" : "border-b border-[#2a2a2a] bg-[#121212]"
      }`}
    >
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Sweepo Logo" width={24} height={24} style={{ height: 'auto' }} />
          <span className="text-lg font-medium"></span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          {/* Navigation links removed as requested */}
        </nav>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/how-it-works" className="text-gray-400 hover:text-white text-xs transition-colors">
          How it works
        </Link>
        <Link href="/about" className="text-gray-400 hover:text-white text-xs transition-colors">
          About Us
        </Link>
        <Link href="/contact" className="text-gray-400 hover:text-white text-xs transition-colors">
          Contact Us
        </Link>
        {user ? (
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-white text-xs transition-colors"
            >
              Sign Out
            </button>
            <Link href="/projects" className="bg-[#2a2a2a] rounded-full w-6 h-6 flex items-center justify-center">
              <span className="text-white text-xs">👤</span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-gray-400 hover:text-white text-xs transition-colors">
              Sign In
            </Link>
            <div className="bg-[#2a2a2a] rounded-full w-6 h-6 flex items-center justify-center">
              <span className="text-white text-xs">👤</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-gray-400 hover:text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-16 left-0 right-0 bg-[#121212] border-b border-[#2a2a2a] py-4 px-8 z-50 md:hidden"
        >
          <nav className="flex flex-col space-y-4">
            {/* Navigation links removed as requested */}
            <div className="border-t border-[#2a2a2a] my-2 pt-2">
              <Link
                href="/how-it-works"
                className="text-gray-400 hover:text-white text-sm py-2 block transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it works
              </Link>
              <Link
                href="/about"
                className="text-gray-400 hover:text-white text-sm py-2 block transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-white text-sm py-2 block transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>
            <div className="border-t border-[#2a2a2a] pt-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-white bg-[#2a2a2a] hover:bg-[#3a3a3a] py-2 px-4 rounded text-sm block text-center transition-colors w-full"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-white bg-[#2a2a2a] hover:bg-[#3a3a3a] py-2 px-4 rounded text-sm block text-center transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
                    </div>
                </nav>
        </motion.div>
      )}
            </header>
    );
};

export default Header;
