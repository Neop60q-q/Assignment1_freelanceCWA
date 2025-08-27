'use client';
import React, { useState } from "react";

export default function Home() {
    return (
        <div className="mt-8 bg-card border border-border p-6">
          <h3 className="text-xl font-semibold mb-4">How to Use:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <strong>1. Enter Content:</strong> Type your content in the text box
            </div>
            <div>
              <strong>2. Generate:</strong> Click "Generate HTML Code" button
            </div>
            <div>
              <strong>3. Download/Copy:</strong> Save the file or copy the code
            </div>
          </div>
        </div>
    );

}