'use client';
import React from 'react';
import Navbar from '../Components/navBar';
import Footer from '../Components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About</h1>
          
          <div className="bg-card border border-border p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Student Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> Huu Tri</p>
              <p><strong>Student Number:</strong> 21709122</p>
              <p><strong>Course:</strong> CSE3CWA - Assignment 1</p>
            </div>
          </div>

          <div className="bg-card border border-border p-8">
            <h2 className="text-2xl font-semibold mb-4">How to Use This Website</h2>
            <div className="aspect-video bg-muted flex items-center justify-center mb-4">
              <p className="text-muted-foreground">Video placeholder - Upload your tutorial video here</p>
            </div>
            <p className="text-muted-foreground">
              This video demonstrates how to use this website and it intended features.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}