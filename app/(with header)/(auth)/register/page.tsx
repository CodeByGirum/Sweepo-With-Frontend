/**
 * Registration Page Component
 * Purpose: Handles new user registration and account creation
 * Used in: Authentication flow
 * Features:
 * - Form validation
 * - Password visibility toggle
 * - Terms agreement
 * - Error handling
 * - Animated transitions
 * - Responsive design
 */

'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { motion } from "framer-motion"
import { AdvancedPageTransition } from "@/components/advanced-page-transition"
import { useTransition } from "@/components/transition-provider"
import { useActionState } from "react"
import { startTransition } from "react"
import { createUser } from "@/utils/authActions"
import { getRandomBackgroundImage } from "@/utils/imageUtils"

/**
 * Initial State Configuration
 * @type {Object}
 * Defines the initial state for the registration form
 * @property {string | null} message - Status message
 * @property {Object} errors - Validation errors by field
 */
const initialState: { message: string | null; errors?: Record<string, string[] | undefined> } = {
    message: null,
    errors: {},
};

/**
 * Registration Page Component
 * @returns {JSX.Element} The registration page structure
 * 
 * @description
 * Renders the registration interface with the following features:
 * - Form validation and submission
 * - Password visibility toggles
 * - Terms and conditions agreement
 * - Error message display
 * - Loading state handling
 * - Animated transitions
 * - Background image management
 * 
 * State Management:
 * - Form field states
 * - Validation states
 * - UI states (password visibility)
 * - Loading states
 * - Terms agreement
 * 
 * Effects:
 * - Background image initialization
 * - Form reset after submission
 */
export default function Register() {
  // Hooks and state initialization
  const { transitionType, transitionDuration } = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [state, formAction] = useActionState(createUser, initialState)
  const [backgroundImage, setBackgroundImage] = useState<string>("")

  // Initialize background image on mount
  useEffect(() => {
    setBackgroundImage(getRandomBackgroundImage());
  }, []);

  /**
   * Form submission handler
   * @param {React.FormEvent} e - Form event
   * Processes form submission and user creation
   * - Prevents default form submission
   * - Sets loading state
   * - Creates FormData from form
   * - Submits data to server
   * - Resets form on completion
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    
    startTransition(() => {
      formAction(formData)
      setLoading(false)
      // Reset form fields after submission
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
    })
  }

  /**
   * Animation Configurations
   * Define motion variants for form and item animations
   */
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <AdvancedPageTransition type={transitionType} duration={transitionDuration}>
      <div className="flex min-h-screen bg-[#121212] text-white">
        {/* Background Image Section
         * Left side of the screen on larger displays
         * - Animated entrance
         * - Gradient overlay
         * - Marketing content
         * - Dynamic background
         */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden lg:block lg:w-1/2 bg-[#1a1a1a] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#121212]/90 to-[#121212]/50 z-10"></div>
          <div className="absolute inset-0 flex items-center justify-center p-8 z-20">
            <div className="max-w-lg text-center">
              <h2 className="text-2xl font-medium mb-4">Join the Data Revolution</h2>
              <p className="text-gray-300 mb-6">
                Create an account to start cleaning and analyzing your data with powerful AI-assisted tools.
              </p>
              <p className="text-gray-300 mb-6">
                Sweepo empowers you to offer cutting-edge AI-driven analytics and predictive modeling as part of your service offerings.
              </p>
              <div className="flex justify-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0">
            {backgroundImage && (
              <Image 
                src={backgroundImage} 
                alt="Artistic background" 
                fill 
                className="object-cover" 
                sizes="50vw"
                priority 
              />
            )}
          </div>
        </motion.div>

        {/* Registration Form Section
         * Right side of the screen
         * - Form fields with validation
         * - Error messages
         * - Success message
         * - Animated transitions
         */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-2xl font-medium mb-2">Create an Account</h1>
              <p className="text-gray-400 text-sm">Sign up to get started with Sweepo</p>
            </motion.div>

            {/* Success Message */}
            {state?.message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-[#2a2a2a] text-gray-300 text-sm rounded-md"
              >
                <p>{state.message}</p>
                <Link href="/login" className="text-white hover:text-gray-300 underline transition-colors">
                  Login here
                </Link>
              </motion.div>
            )}

            {/* Error Message */}
            {state?.errors?.root && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-[#2a2a2a] text-red-400 text-sm rounded-md"
              >
                <p>{state.errors.root}</p>
              </motion.div>
            )}

            {/* Registration Form */}
            <motion.form
              variants={formVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name Fields */}
              <div className="flex gap-4">
                {/* First Name Field */}
                <motion.div variants={itemVariants} className="space-y-2 flex-1">
                  <label htmlFor="firstName" className="block text-sm text-gray-400">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-md block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                      placeholder="John"
                      required
                    />
                  </div>
                  {state.errors && state.errors.firstName && (
                    <p className="text-xs text-red-400 mt-1">{state.errors.firstName}</p>
                  )}
                </motion.div>

                {/* Last Name Field */}
                <motion.div variants={itemVariants} className="space-y-2 flex-1">
                  <label htmlFor="lastName" className="block text-sm text-gray-400">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-md block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                      placeholder="Doe"
                      required
                    />
                  </div>
                  {state.errors && state.errors.lastName && (
                    <p className="text-xs text-red-400 mt-1">{state.errors.lastName}</p>
                  )}
                </motion.div>
              </div>

              {/* Email Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="email" className="block text-sm text-gray-400">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-md block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                {state.errors && state.errors.email && (
                  <p className="text-xs text-red-400 mt-1">{state.errors.email}</p>
                )}
              </motion.div>

              {/* Password Fields */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="password" className="block text-sm text-gray-400">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-md block w-full pl-10 pr-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {state.errors && state.errors.password && (
                  <p className="text-xs text-red-400 mt-1">{state.errors.password}</p>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm text-gray-400">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-md block w-full pl-10 pr-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-white transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {state.errors && state.errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">{state.errors.confirmPassword}</p>
                )}
              </motion.div>

              {/* Terms Agreement */}
              <motion.div variants={itemVariants} className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 bg-[#1a1a1a] border-[#2a2a2a] rounded focus:ring-0 focus:ring-offset-0"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                  I agree to the{' '}
                  <Link href="/terms" className="text-white hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-white hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading || !agreeTerms}
                className={`w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white py-2 px-4 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3a3a3a] transition-colors ${
                  (loading || !agreeTerms) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </motion.button>

              {/* Login Link */}
              <motion.p variants={itemVariants} className="text-sm text-center text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-white hover:text-gray-300 transition-colors">
                  Sign in
                </Link>
              </motion.p>
            </motion.form>
          </div>
        </div>
      </div>
    </AdvancedPageTransition>
  );
}