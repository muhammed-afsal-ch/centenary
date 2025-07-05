'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/textlogo.png" alt="Samastha Logo" width={100} height={32} priority />
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <NavLink href="/">Home</NavLink>
            <NavLink href="/all-posts">News</NavLink>
            <NavLink href="/gallery">Gallery</NavLink>
            <NavLink href="/downloads">Downloads</NavLink>
            <NavLink href="/all-podcasts">Podcasts</NavLink>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#1A237E] focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#E6ECEF]/70 backdrop-blur-md">
          <div className="bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 text-[#1A237E] text-2xl"
            >
              ✕
            </button>
            <div className="flex flex-col items-center space-y-6 mt-6">
              <NavLink href="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
              <NavLink href="/all-posts" onClick={() => setIsMenuOpen(false)}>News</NavLink>
              <NavLink href="/gallery" onClick={() => setIsMenuOpen(false)}>Gallery</NavLink>
              <NavLink href="/downloads" onClick={() => setIsMenuOpen(false)}>Downloads</NavLink>
              <NavLink href="/all-podcasts" onClick={() => setIsMenuOpen(false)}>Podcasts</NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      className="text-[#1A237E] hover:text-[#FFD700] transition-colors duration-300 text-base font-medium"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}