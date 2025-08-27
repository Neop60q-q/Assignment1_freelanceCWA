'use client';
import React, { useState } from "react";
import Navbar from "./Components/navBar";

export default function Home() {
  const [userContent, setUserContent] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');

  const generateHtml = () => {
    if (!userContent.trim()) {
      alert('Please enter some content first');
      return;
    }

    const html = `<!DOCTYPE html>
<html>
<head>
    <title>Generated Page</title>
</head>
<body>
    <h1>${userContent}</h1>
</body>
</html>`;

    setGeneratedHtml(html);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHtml);
    alert('copied code to clipboard');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">HTML Code Generator</h1>
          <p className="text-lg text-muted-foreground">
            Enter your content to generate HTML code
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card border border-border p-6">
            <h2 className="text-2xl font-semibold mb-6">Enter your content</h2>
            
            <textarea
              value={userContent}
              onChange={(e) => setUserContent(e.target.value)}
              placeholder="Enter your content here..."
              className="w-full h-32 p-4 border border-border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button 
              className="w-full mt-6 bg-primary text-primary-foreground py-3 px-4 hover:bg-primary/90 transition-colors"
              onClick={generateHtml}
            >
              Generate HTML Code
            </button>
          </div>

          {/*Code output */}
          <div className="bg-card border border-border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Generated Code</h2>
              {generatedHtml && (
                <div className="flex gap-2">

                  <button
                    onClick={copyToClipboard}
                    className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>

            {generatedHtml ? (
              <pre className="bg-muted p-4 overflow-x-auto text-sm h-96">
                <code>{generatedHtml}</code>
              </pre>
            ) : (
              <div className="bg-muted p-8 text-center text-muted-foreground h-96 flex items-center justify-center">
                <div>
                  <p className="text-lg mb-2">No code generated yet</p>
                  <p>Enter content and click "Generate HTML Code"</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
