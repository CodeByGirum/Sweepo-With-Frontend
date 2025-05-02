/**
 * Login Page Component
 * Purpose: Handles user authentication and login functionality
 * Used in: Authentication flow
 * Features:
 * - Form validation
 * - Password visibility toggle
 * - Remember me functionality
 * - Error handling
 * - Animated transitions
 * - Responsive design
 */

'use client'
import { useRouter } from 'next/navigation';
import { login } from "@/utils/authActions";
import { getRandomBackgroundImage } from "@/utils/imageUtils";
import Image from "next/image"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { startTransition } from "react";
import { useGlobalContext } from '@/context/context';
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { AdvancedPageTransition } from "@/components/advanced-page-transition";
import { useTransition } from "@/components/transition-provider";

/**
 * User Payload Interface
 * @interface Payload
 * Defines the structure of user data returned after successful login
 */
interface Payload {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
}

/**
 * Initial State Configuration
 * Defines the initial state for the login form and authentication process
 * @type {Object}
 * @property {string | null} message - Status message
 * @property {Object} errors - Validation errors
 * @property {boolean} isLoggedIn - Authentication status
 * @property {string | null} accessToken - JWT token
 * @property {string | null} userId - User identifier
 * @property {Payload} payload - User data
 */
const initialState: {
    message: string | null, 
    errors?: Record<string, string[] | undefined>, 
    isLoggedIn?: boolean,
    accessToken?: string | null,
    userId?: string | null,
    payload?: Payload
} = {
    message: null,
    isLoggedIn: false,
    errors: {},
    accessToken: null,
    userId: null,
    payload: {
        userId: "",
        email: "",
        firstName: "",
        lastName: ""
    }
}

/**
 * Login Page Component
 * @returns {JSX.Element} The login page structure
 * 
 * @description
 * Renders the login interface with the following features:
 * - Form validation and submission
 * - Password visibility toggle
 * - Remember me checkbox
 * - Error message display
 * - Loading state handling
 * - Animated transitions
 * - Background image management
 * 
 * State Management:
 * - Form state and validation
 * - Loading states
 * - User context
 * - UI states (password visibility, remember me)
 * 
 * Effects:
 * - Background image initialization
 * - Authentication state monitoring
 * - Redirect after successful login
 */
const Login = () => {
    // Hooks and state initialization
    const { transitionType, transitionDuration } = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [state, formAction] = useActionState(login, initialState);
    const [loading, setLoading] = useState<boolean>(false);
    const { setUser } = useGlobalContext();
    const router = useRouter();
    const [backgroundImage, setBackgroundImage] = useState<string>("");
    
    // Initialize background image on mount
    useEffect(() => {
        setBackgroundImage(getRandomBackgroundImage());
    }, []);
    
    /**
     * Form submission handler
     * @param {React.FormEvent<HTMLElement>} e - Form event
     * Processes form submission and triggers authentication
     */
    const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement)
        startTransition(() => {
            formAction(formData);
            setLoading(false);
        });
    }
    
    // Monitor authentication state and redirect on success
    useEffect(() => {
        if (state?.isLoggedIn && state?.payload) {
            setUser(state?.payload)
            router.push("/projects")
        }
    }, [state, router, setUser])

    /**
     * Animation Configurations
     * Define motion variants for form animations
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
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <AdvancedPageTransition type={transitionType} duration={transitionDuration}>
            <div className="flex min-h-screen bg-[#121212] text-white">
                {/* Login Form Section
                 * Left side of the screen containing the form
                 * - Responsive layout
                 * - Animated entrance
                 * - Form validation
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
                            <h1 className="text-2xl font-medium mb-2">Welcome to Sweepo</h1>
                            <p className="text-gray-400 text-sm">Sign in to continue to your dashboard</p>
                        </motion.div>

                        {/* Error Message Display */}
                        {(state?.errors?.root) && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-900/30 border border-red-800 text-red-100 px-4 py-2 rounded-md mb-6"
                            >
                                <p className="text-sm font-medium">{state.errors.root}</p>
                            </motion.div>
                        )}

                        {/* Login Form */}
                        <motion.form
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            onSubmit={handleSubmit}
                            method="POST"
                            className="space-y-6"
                        >
                            {/* Email Input Field */}
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label htmlFor="email" className="block text-sm text-gray-400">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-md block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                                {state.errors && state.errors.email && (
                                    <p className="text-sm text-red-400">{state.errors.email}</p>
                                )}
                            </motion.div>

                            {/* Password Input Field */}
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label htmlFor="password" className="block text-sm text-gray-400">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
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
                                    <p className="text-sm text-red-400">{state.errors.password}</p>
                                )}
                            </motion.div>

                            {/* Remember Me and Forgot Password Section */}
                            <motion.div variants={itemVariants} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 bg-[#1a1a1a] border-[#2a2a2a] rounded focus:ring-0 focus:ring-offset-0 transition-colors"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400">
                                        Remember me
                                    </label>
                                </div>
                                <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Forgot password?
                                </Link>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.button
                                variants={itemVariants}
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#121212] transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </motion.button>

                            {/* Registration Link */}
                            <motion.p variants={itemVariants} className="text-sm text-center text-gray-400">
                                Don't have an account?{' '}
                                <Link href="/register" className="text-blue-500 hover:text-blue-400 transition-colors">
                                    Create one
                                </Link>
                            </motion.p>
                        </motion.form>
                    </div>
                </div>

                {/* Background Image Section
                 * Right side of the screen on larger displays
                 * - Responsive image display
                 * - Dynamic background selection
                 */}
                <div className="hidden lg:block lg:w-1/2 relative">
                    {backgroundImage && (
                        <Image
                            src={backgroundImage}
                            alt="Login background"
                            fill
                            className="object-cover"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                </div>
            </div>
        </AdvancedPageTransition>
    );
};

export default Login;