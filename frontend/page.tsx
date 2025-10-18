'use client';
import React, { useState } from "react";
import Navbar from "./Components/navBar";
import { useTabs } from "./createTab/useTabs";
import TabCard from "./Components/TabCard";

export default function Home() {
  const [title, setTitle] = useState('');
  const [userContent, setUserContent] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');
  
  // Use our custom hook instead of manual state management
  const { tabs, addTab, viewTab, removeTab } = useTabs();

  const generateHtml = () => {
    if (!userContent.trim()) {
      alert('Please enter some content first');
      return;
    }

    const html = `<!DOCTYPE html>
<html>
<head>
    <title>${title || 'Generated Page'}</title>
</head>
<body>
    <h1>${title || 'Generated Page'}</h1>
    <p>${userContent}</p>
</body>
</html>`;

    setGeneratedHtml(html);
    
    // Create a new tab using our hook
    const newTab = {
      name: title || 'Generated Page',
      url: `data:text/html;charset=utf-8,${encodeURIComponent(html)}`,
      icon: '📄',
      category: 'Generated HTML',
      content: html
    };
    
    addTab(newTab);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHtml);
    alert('copied code to clipboard');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center h-16">
          <h1>
            displayTabs: {tabs.length}
          </h1>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card border border-border p-6">
            <h2 className="text-2xl font-semibold mb-6">Enter your content</h2>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter page title..."
              className="w-full p-3 border border-border bg-background text-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
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

          {/* Code output */}
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

        {/* Display Generated Tabs - Now using TabCard component */}
        {tabs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Your Generated Tabs ({tabs.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tabs.map((tab) => (
                <TabCard 
                  key={tab.id} 
                  tab={tab} 
                  onView={viewTab} 
                  onDelete={removeTab}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
