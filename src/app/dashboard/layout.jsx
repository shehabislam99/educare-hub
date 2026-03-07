"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Layout,
    BookOpen,
    PlusCircle,
    Users,
    Star,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    GraduationCap,
    Home
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../../assets/istockphoto-1215255370-612x612.jpg";

export default function DashboardLayout({ children }) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const userRole = session?.user?.role || "student";
    const userName = session?.user?.name || session?.user?.username || "A";

    const instructorLinks = [
        { name: 'Dashboard', href: '/dashboard/instructor', icon: Layout },
        { name: 'Manage Courses', href: '/dashboard/instructor/manage-course', icon: BookOpen },
        { name: 'Create Course', href: '/dashboard/instructor/create-course', icon: PlusCircle },
        { name: 'Home Site', href: '/', icon: Home },
    ];

    const studentLinks = [
        { name: 'Dashboard', href: '/dashboard/student', icon: Layout },
        { name: 'My Enrollments', href: '/dashboard/student/my-enrollments', icon: GraduationCap },
        { name: 'Browse Courses', href: '/course', icon: BookOpen },
        { name: 'Home Site', href: '/', icon: Home },
    ];

    const links = userRole === 'instructor' ? instructorLinks : studentLinks;

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Desktop Sidebar */}
            <aside className={`
                hidden lg:flex flex-col bg-white border-r border-slate-100 transition-all duration-300
                ${isSidebarOpen ? 'w-72' : 'w-20'}
            `}>
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center overflow-hidden">
                                <img src={logo.src || logo} alt="EduHub Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-xl text-slate-900">EduHub</span>
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center overflow-hidden mx-auto">
                            <img src={logo.src || logo} alt="EduHub Logo" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`
                                    flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group
                                    ${isActive
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}
                                `}
                            >
                                <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-indigo-600'}`} />
                                {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{link.name}</span>}
                                {isSidebarOpen && isActive && (
                                    <motion.div layoutId="activeInd" className="ml-auto">
                                        <ChevronRight className="w-4 h-4" />
                                    </motion.div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Bottom Profile */}
                <div className="p-4 border-t border-slate-50">
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className={`
                            flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-red-500 hover:bg-red-50 transition-all
                            ${!isSidebarOpen && 'justify-center px-0'}
                        `}
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="font-bold text-sm">Logout</span>}
                    </button>

                    {isSidebarOpen && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                                {userName[0].toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{userRole}</p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Navigation */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-100 z-50 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center overflow-hidden">
                        <img src={logo.src || logo} alt="EduHub Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-lg">EduHub</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-slate-600 bg-slate-50 rounded-lg"
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="lg:hidden fixed inset-0 z-40 bg-white pt-20 px-4"
                    >
                        <nav className="space-y-2">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                                        flex items-center gap-4 px-6 py-4 rounded-2xl font-bold
                                        ${pathname === link.href ? 'bg-indigo-600 text-white' : 'text-slate-600 bg-slate-50'}
                                    `}
                                >
                                    <link.icon className="w-5 h-5" />
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="w-full mt-8 flex items-center gap-4 px-6 py-4 rounded-2xl text-red-600 bg-red-50 font-bold"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
