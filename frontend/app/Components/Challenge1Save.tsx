'use client';
import React, { useState } from 'react';
import { Button } from './ui/button';

const API_URL = "http://ec2-54-156-92-118.compute-1.amazonaws.com:4080";

interface Challenge1SaveProps {
  className?: string;
}

export default function Challenge1Save({ className = "" }: Challenge1SaveProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Get Challenge 1 data from localStorage
      const question = localStorage.getItem('stage_1_question') || '';
      const code = localStorage.getItem('stage_1_code') || '';
      const timerState = localStorage.getItem('questionnaire_timer_state');
      const timer = timerState ? JSON.parse(timerState).timerCount : 60;

      // Simple validation
      if (!question.trim()) {
        alert('Please enter a question first');
        setIsSaving(false);
        return;
      }

      if (!code.trim()) {
        alert('Please enter some code first');
        setIsSaving(false);
        return;
      }

      // Save to API
      const response = await fetch(`${API_URL}/api/questionnaires`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          timer: timer,
          question: question,
          expectedAnswer: code 
        }),
      });

      if (response.ok) {
        alert('Challenge 1 saved successfully!');
      } else {
        throw new Error('Failed to save');
      }

    } catch (error) {
      console.error('Error saving Challenge 1:', error);
      alert('Error saving Challenge 1');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={className}>
      <Button 
        onClick={handleSave}
        disabled={isSaving}
        variant="default"
      >
        {isSaving ? 'Saving...' : 'Save Challenge 1'}
      </Button>
    </div>
  );
}