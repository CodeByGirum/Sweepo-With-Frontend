/**
 * Side Menu Component
 * Purpose: Provides navigation menu with collapsible functionality
 * Used in: Main application layout
 * Features:
 * - Responsive design
 * - Collapsible menu
 * - Active route highlighting
 * - User profile display
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LuLayoutDashboard } from "react-icons/lu";
import { TbReportSearch } from "react-icons/tb";
import { FaBarsStaggered } from "react-icons/fa6";
import { GoProjectSymlink } from "react-icons/go";
import { FaDatabase } from "react-icons/fa6";
import { useGlobalContext } from '@/context/context';

/**
 * Side menu component with collapsible functionality
 * - Handles responsive behavior
 * - Displays user information
 * - Provides navigation links
 * - Highlights active route
 */
const SideMenu = () => {
    const [isMenuHide, setIsMenuHide] = useState<boolean>(false);
    const { user } = useGlobalContext();
    const pathname = usePathname(); // Get current path

    /**
     * Handles window resize events to adjust menu visibility
     */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMenuHide(true);
            } else {
                setIsMenuHide(false);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={`flex flex-col background absolute md:relative justify-between z-20 ${isMenuHide ? 'items-center px-0' : 'w-60 flex max-w-80 px-3 min-h-screen'}`}>
            <header
                className={`flex items-center primary md:relative mb-1 heading font-bold text-lg py-2 px-3 rounded-lg cursor-pointer hover:secondaryBtnText ${isMenuHide ? 'justify-center' : 'justify-end relative'} z-30`}
                onClick={() => setIsMenuHide(!isMenuHide)}
            >
                <FaBarsStaggered />
            </header>
            <nav className={`h-full w-full flex flex-col absolute right-0 mt-14 md:mt-2 md:relative ${isMenuHide ? 'items-center hidden px-0' : 'flex px-3'}`}>
                <div className={`flex items-center sectionBg rounded-md h-12 border border-gray-700 px-6 mb-5 ${isMenuHide ? 'hidden' : 'block'}`}>
                    <span className='text-center heading font-semibold'>{user?.firstName}&nbsp;{user?.lastName}</span>
                </div>

                {/* Navigation links with active state */}
                {[
                    { href: '/projects', icon: <GoProjectSymlink />, label: 'Projects' },
                    { href: '/dashboard', icon: <LuLayoutDashboard />, label: 'Dashboard' },
                    { href: '/datasets', icon: <FaDatabase />, label: 'Datasets' },
                    { href: '/reports', icon: <TbReportSearch />, label: 'Reports' },
                ].map(({ href, icon, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`sideMenuLink ${isMenuHide ? 'justify-center py-1 px-1' : 'justify-normal'}
                          ${pathname === href ? 'bg-gray-700 text-white' : 'hover:bg-gray-600 hover:text-white'}`}
                    >
                        {icon}
                        <span className={`${isMenuHide ? 'hidden' : 'block'}`}>{label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default SideMenu;
