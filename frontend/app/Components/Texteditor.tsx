'use client';
import React, { useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { consoleLight, consoleDark } from '@uiw/codemirror-theme-console';
import { useTheme } from 'next-themes';

interface TextEditorProps {
  stageId: number;  // Unique identifier for each stage
  initialCode?: string;
  onChange?: (value: string) => void;
  onSave?: (code: string) => Promise<void>; // For database integration
}

export default function TextEditor({ 
  stageId, 
  initialCode = '', 
  onChange,
  onSave 
}: TextEditorProps) {
  const { theme } = useTheme();
  const [code, setCode] = React.useState(initialCode);
  const storageKey = `stage_${stageId}_code`;
  const [showSavedToast, setShowSavedToast] = React.useState(false);

  // Load locally saved code. For cookies
  useEffect(() => {
    const savedCode = localStorage.getItem(storageKey);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [storageKey]);

  // Handle code changes, save to localStrorage
  const handleChange = React.useCallback((value: string) => {
    setCode(value);
    localStorage.setItem(storageKey, value);
    
    if (onChange) {
      onChange(value);
    }
  }, [onChange, storageKey]);

  // Auto-save function (can be used for database integration)
  const handleSave = React.useCallback(async () => {
    if (onSave) {
      try {
        await onSave(code);
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 2000);
      } catch (error) {
        console.error('Error saving code:', error);
      }
    }
  }, [code, onSave]);

  // Auto-save every 30 seconds if onSave is provided
  useEffect(() => {
    if (!onSave) return;

    const saveInterval = setInterval(handleSave, 30000);
    return () => clearInterval(saveInterval);
  }, [handleSave, onSave]);

  return (
    <div className="w-full rounded-md border">
      <CodeMirror
        value={code}
        height="200px"
        theme={theme === 'dark' ? consoleDark : consoleLight}
        extensions={[javascript({ jsx: true })]}
        onChange={handleChange}
        className="text-sm"
      />
      {onSave && (
        <div className="flex items-center justify-end p-2">
          <button
            onClick={handleSave}
            className="mt-2 px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Save
          </button>
        </div>
      )}

      {showSavedToast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md border bg-background shadow-lg px-3 py-2 text-sm">
          Saved
        </div>
      )}
    </div>
  );
}