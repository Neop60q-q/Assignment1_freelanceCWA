'use client';
import React, { useState } from 'react';

interface Stage3Props {
  onComplete: () => void;
}

export default function Stage3({ onComplete }: Stage3Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const question = {
    text: "Which security protocol would be most effective for bypassing the main reactor's quantum encryption?",
    options: [
      {
        id: 'a',
        text: 'SHA-256 Encryption with ROT13',
      },
      {
        id: 'b',
        text: 'Quantum Tunneling Protocol',
      },
      {
        id: 'c',
        text: 'Binary Symmetric Channel',
      },
      {
        id: 'd',
        text: 'Temporal Decryption Algorithm',
      }
    ],
    correctAnswer: 'b'
  };

  const checkAnswer = () => {
    if (!selectedAnswer) {
      setError('Please select an answer');
      return;
    }

    setAttempts(prev => prev + 1);

    if (selectedAnswer === question.correctAnswer) {
      onComplete();
    } else {
      setError('Incorrect answer. The security system detected unauthorized access!');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Stage 3: Final Security Override</h2>
        <p className="text-muted-foreground mb-4">
          Choose the correct security protocol to complete your escape.
        </p>

        <div className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium mb-4">{question.text}</p>
            
            <div className="space-y-3">
              {question.options.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedAnswer === option.id
                      ? 'bg-primary/10 border border-primary'
                      : 'bg-card border border-border hover:border-primary'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option.id}
                    checked={selectedAnswer === option.id}
                    onChange={(e) => {
                      setSelectedAnswer(e.target.value);
                      setError('');
                    }}
                    className="hidden"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedAnswer === option.id
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}
                  />
                  <span className="flex-1">{option.text}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={checkAnswer}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Override Security
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}