'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Lock, Info, Plus, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { motion } from 'framer-motion';

import { ASSETS } from '@/types';

export default function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide the global NavBar on pages that have their own navigation
  if (pathname.startsWith('/write') || pathname.startsWith('/private/garden')) {
    return null;
  }

  const tabs = [
    { href: '/', label: 'Public garden', icon: Globe },
    { href: '/private', label: 'Private gardens', icon: Lock },
    { href: '/about', label: 'About', icon: Info },
  ];

  return (
    <>
      <nav className="fixed top-0 z-[100] w-full bg-[#FDFCFB]/80 backdrop-blur-md border-b border-[#e8e0d4]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Left side: Logo */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
              <img
                src={ASSETS.flower}
                alt=""
                className="h-7 sm:h-8 w-auto group-hover:rotate-12 transition-transform duration-500 opacity-90"
              />
              <span className="font-poppins text-[15px] sm:text-[16px] text-[#3b3833] tracking-tight font-semibold">
                LetterGarden
              </span>
            </Link>
          </div>

          {/* Centre tabs — hidden on mobile */}
          <div className="hidden md:flex items-center justify-center gap-1 shrink-0">
            {tabs.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    'relative flex items-center gap-2 px-5 py-2 text-[14px] font-poppins rounded-[6px] transition-colors duration-300 z-10',
                    active
                      ? 'text-[#3b3833] font-semibold'
                      : 'text-[#8a7d6b] hover:text-[#3b3833] font-medium hover:bg-[#f8f5f0]'
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="active-nav-tab"
                      className="absolute inset-0 bg-[#f0ebe3] rounded-[6px] -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon size={15} strokeWidth={1.5} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side: Write button + mobile hamburger */}
          <div className="flex-1 flex items-center justify-end gap-2">
            {/* Write button — shorter text on mobile */}
            {!pathname.startsWith('/private') && (
              <Link
                href="/write"
                className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-[6px] bg-[#3b3833] text-white text-[13px] sm:text-[14px] font-poppins font-semibold hover:bg-[#1a1a1a] transition-all duration-300 shadow-sm hover:shadow-md shrink-0"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span className="hidden sm:inline">Write public letter</span>
                <span className="sm:hidden">Write</span>
              </Link>
            )}

            {/* Hamburger — visible on mobile only */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[#3b3833] hover:bg-[#f0ebe3] rounded-[6px] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#e8e0d4]/50 bg-[#FDFCFB]/95 backdrop-blur-md px-4 pb-4 pt-2 space-y-1">
            {tabs.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 text-[14px] font-poppins font-semibold rounded-[6px] transition-all duration-200',
                    active
                      ? 'text-[#3b3833] bg-[#f0ebe3]'
                      : 'text-[#8a7d6b] hover:text-[#3b3833] hover:bg-[#f8f5f0]'
                  )}
                >
                  <Icon size={16} strokeWidth={1.5} />
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
}
