/**
 * Landing Page Component
 * Purpose: Serves as the main entry point and landing page of the application
 * Used in: Root route (/)
 * Features:
 * - Animated hero section
 * - Interactive UI elements
 * - Background animations
 * - Responsive design
 * - Call-to-action elements
 */

'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Landing Page Component
 * @returns {JSX.Element} The landing page structure
 * 
 * @description
 * Renders the main landing page with the following sections:
 * 1. Grid Background - Creates a subtle grid pattern
 * 2. Animated Stars - Adds dynamic shooting star animations
 * 3. Hero Section - Contains main content and CTA
 * 4. Background Decoration - Adds depth with gradient effects
 * 
 * Features:
 * - Responsive layout for all screen sizes
 * - Motion animations for enhanced UX
 * - Interactive hover effects
 * - Dynamic background elements
 * - Optimized performance with CSS animations
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col relative overflow-hidden">
      {/* Grid Background Section
       * Creates a subtle grid pattern overlay
       * - Uses CSS gradients for performance
       * - Adds visual structure to the page
       * - Maintains consistent spacing
       */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(to right, #2a2a2a 1px, transparent 1px), linear-gradient(to bottom, #2a2a2a 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Animated Stars Section
       * Implements shooting star animations
       * - Uses pure CSS for optimal performance
       * - Multiple stars with different timings
       * - Creates dynamic visual interest
       */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="star-1"></div>
        <div className="star-2"></div>
        <div className="star-3"></div>
      </div>

      {/* Hero Section
       * Main content area with call-to-action
       * - Animated entrance effects
       * - Responsive text sizing
       * - Centered layout with max-width
       * - Clear hierarchy with spacing
       */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-16 md:py-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl text-center"
        >
          <h1 className="text-4xl md:text-5xl font-medium mb-6 text-white">
            Transform Your Data Cleaning Workflow
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Sweepo helps you clean, transform, and analyze your data with powerful AI-assisted tools.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href="/login" className="inline-flex items-center bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-6 py-3 rounded-md font-medium transition-colors group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Background Decoration Section
       * Adds depth with gradient overlays
       * - Blurred circular gradients
       * - Positioned for visual balance
       * - Non-interactive elements
       */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#1a1a1a] blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-[#1e1e1e] blur-[120px]"></div>
      </div>

      {/* CSS Animations
       * Defines shooting star animations
       * - Custom keyframe animations
       * - Variable timing and delays
       * - Opacity and size transitions
       * - Optimized for performance
       */}
      <style jsx>{`
        .star-1, .star-2, .star-3 {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          opacity: 0;
          border-radius: 50%;
          box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.3);
        }

        .star-1 {
          top: 30%;
          left: -5%;
          animation: shooting-star 8s linear infinite;
          animation-delay: 1s;
        }

        .star-2 {
          top: 50%;
          left: -5%;
          animation: shooting-star 12s linear infinite;
          animation-delay: 4s;
        }

        .star-3 {
          top: 70%;
          left: -5%;
          animation: shooting-star 6s linear infinite;
          animation-delay: 7s;
        }

        @keyframes shooting-star {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 0;
            width: 0;
          }
          
          5% {
            opacity: 0.7;
            width: 0;
          }
          
          10% {
            transform: translateX(20vw) translateY(5vh);
            width: 5px;
            opacity: 0.8;
          }
          
          20% {
            width: 3px;
            opacity: 0.6;
          }
          
          30% {
            transform: translateX(40vw) translateY(10vh);
            width: 2px;
            opacity: 0.4;
          }
          
          70% {
            transform: translateX(80vw) translateY(20vh);
            width: 1px;
            opacity: 0.2;
          }
          
          100% {
            transform: translateX(100vw) translateY(25vh);
            opacity: 0;
            width: 0;
          }
        }
      `}</style>
    </div>
  );
}
