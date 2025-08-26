'use client';
import React, { useState, useRef, useEffect } from "react";
// Remove Bootstrap imports since they override dark mode
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import HamburgerMenu from './Components/hamburgerMenu';
import Navbar from "./Components/navBar"; 
import { ModeToggle } from "./Components/ModeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-4">
        <ModeToggle/>
      </div>
      
      <div className="flex items-center justify-center gap-4 my-8">
        <Navbar/>
        <h1 className="text-2xl font-bold">Welcome to My Next.js App</h1>
      </div>
    </div>
  );
}
