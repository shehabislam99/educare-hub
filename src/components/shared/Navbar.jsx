"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Layout,
  Sun,
  Moon,
} from "lucide-react";
import logo from "../../assets/istockphoto-1215255370-612x612.jpg"
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/components/ThemeProvider";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isLoggedIn = status === "authenticated";
  const user = session?.user;
  const userRole = user?.role || "student";

  const dashboardLink = userRole === "instructor" ? "/dashboard/instructor" : "/dashboard/student";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <img src={logo.src || logo} alt="EduHub Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-slate-100">
                EduHub
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/course"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
            >
              Explore Courses
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
            >
              About Us
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isLoggedIn ?
              <div className="flex items-center gap-4">
                {userRole === "student" && (
                  <button className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] flex items-center justify-center rounded-full">
                      0
                    </span>
                  </button>
                )}

                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 pl-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {user?.name || user?.username || "A"}
                    </span>
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-indigo-600 w-4 h-4" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800 mb-2">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {user?.name || user?.username || "User"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {user?.email}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 rounded">
                            {userRole}
                          </span>
                        </div>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                        >
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <Link
                          href={dashboardLink}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                        >
                          <Layout className="w-4 h-4" /> Dashboard
                        </Link>
                        <button
                          onClick={async () => {
                            await fetch("/api/logout", { method: "POST" });
                            signOut({ callbackUrl: "/login" });
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              : <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl px-4 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link href="/signup" className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm">
                  Sign Up
                </Link>
              </div>
            }
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-200"
            >
              {isMenuOpen ?
                <X />
                : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
              <Link
                href="/course"
                className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
              >
                Explore
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
              >
                About Us
              </Link>
              {!isLoggedIn && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href="/login"
                    className="text-center px-3 py-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-lg"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-center px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              {isLoggedIn && (
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                >
                  Profile
                </Link>
              )}
              {isLoggedIn && (
                <Link
                  href={dashboardLink}
                  className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                >
                  Dashboard
                </Link>
              )}
              {isLoggedIn && (
                <button
                  onClick={async () => {
                    await fetch("/api/logout", { method: "POST" });
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                >
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
