'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import AppLogo from '@/components/ui/AppLogo';
import { Menu, X, Moon, Sun, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

const navLinks = [
  { label: 'Home', href: '/home', key: 'nav-home' },
  { label: 'Listings', href: '/room-listing-page', key: 'nav-listings' },
  { label: 'About', href: '/about', key: 'nav-about' },
  { label: 'Contact', href: '/contact', key: 'nav-contact' },
];

export default function Topbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router?.push('/home');
  };

  const getDashboardLink = () => {
    if (!user) return '/sign-up-login-screen';
    if (user?.role === 'admin') return '/admin-dashboard';
    if (user?.role === 'landlord') return '/landlord-dashboard';
    return '/student-dashboard';
  };

  const isHeroPage = pathname === '/home' || pathname === '/';
  const isTransparent = isHeroPage && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHeroPage
          ? 'bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(2,6,23,0.06)] border-b border-gray-100 dark:bg-gray-900/95 dark:border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-3 flex-shrink-0">
            <AppLogo size={44} />
            <span
              className={`font-bold text-2xl tracking-tight transition-colors duration-300 ${
                isTransparent ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}
            >
              UniBoard
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks?.map((link) => (
              <Link
                key={link?.key}
                href={link?.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isTransparent
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'
                } ${pathname === link?.href ? (isTransparent ? 'text-white bg-white/10' : 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30') : ''}`}
              >
                {link?.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg transition-colors ${
                isTransparent ? 'text-white/80 hover:bg-white/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Toggle dark mode"
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isTransparent ? 'text-white/90 hover:bg-white/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.fullName?.charAt(0)}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.fullName?.split(' ')?.[0]}</span>
                </button>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2"
                  >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.fullName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                    >
                      <LayoutDashboard size={15} />
                      Dashboard
                    </Link>
                    <Link
                      href="/sign-up-login-screen"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User size={15} />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/sign-up-login-screen"
                  className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-150 ${
                    isTransparent
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href="/sign-up-login-screen"
                  className="bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-150 shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg transition-colors ${
                isTransparent ? 'text-white/80' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Toggle dark mode"
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks?.map((link) => (
                <Link
                  key={`mobile-${link?.key}`}
                  href={link?.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                >
                  {link?.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                {isAuthenticated && user ? (
                  <>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30"
                    >
                      <LayoutDashboard size={15} />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 border border-red-100 dark:border-red-900/50"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/sign-up-login-screen"
                      onClick={() => setMobileOpen(false)}
                      className="block text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/sign-up-login-screen"
                      onClick={() => setMobileOpen(false)}
                      className="block text-center bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors"
                    >
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}