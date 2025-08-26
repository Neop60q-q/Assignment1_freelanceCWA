'use client';
import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure Bootstrap JS is loaded


import HamburgerMenu from './Components/hamburgerMenu';
import Navbar from "./Components/navBar"; 
import ModeToggle from "./Components/ModeToggle";



export default function Home() {
  

  return (
    <>
    <ModeToggle/>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // Center horizontally
          gap: "1rem",
          margin: "2rem 0"
        }}
      >
        <Navbar/>
        <h1>Welcome to My Next.js App</h1>
      </div>
    </>
  );
}
