'use client';
import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import HamburgerMenu from './Components/hamburgerMenu';
import Navbar from "./Components/navBar"; 
import { ModeToggle } from "./Components/ModeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      
      <div className="flex items-center justify-center gap-4 my-8">
        <h1 className="text-2xl font-bold">Welcome to My Next.js App</h1>
      </div>

      <div className= "bg-background">
        <Navbar/>
      </div>
    </div>
  );
}
