"use client"
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-background border-t-2 border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 Huu Tri - Student Number: 21709122</p>
          <p>Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 