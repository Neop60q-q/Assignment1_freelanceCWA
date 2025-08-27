"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { ModeToggle } from './ModeToggle';
import HamburgerMenu from './hamburgerMenu';

const Navbar = () => {

  return (
    // NavBar layout
    <nav className="bg-background border-t-2 border-b-2 border-border"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-foreground">
              21709122 Huu Tri
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              About
            </Link>

            <Link 
              href="/Testpage1" 
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Testpage1
            </Link>
            <Link 
              href="/Testpage2" 
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Testpage2
            </Link>
          </div>

          {/* Darkmode and Hamburger Menu */}
          <div>
            <ModeToggle />
          </div>
          <div>
            <HamburgerMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
