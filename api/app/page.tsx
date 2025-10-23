// renders api documentation page with dynamic base URL

'use client';

import React, { useEffect, useState } from 'react';

const getPathUrl = () => {
  if (typeof window !== 'undefined') {
    return new URL(window.location.href).origin.replace(/\/$/, '');
  }
  return ''; // Fallback for SSR
};

const ApiDocumentation: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(getPathUrl());
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Questionnaire API Documentation</h1>
      <p>
        <strong>GET, POST, PATCH, DELETE</strong> requests to{' '}
        <code>{baseUrl}/api/questionnaires</code> for managing questionnaires:
      </p>
      <ul>
        <li><code>id</code>: ID of the questionnaire (integer)</li>
        <li><code>timer</code>: Timer duration in seconds</li>
        <li><code>question</code>: Main question/title</li>
        <li><code>expectedAnswer</code>: Expected answer or challenge description</li>
      </ul>
      <p>All responses return JSON data with proper HTTP status codes.</p>

      <h3>1. GET Request - Fetch Questionnaires</h3>
      <p>Get all questionnaires:</p>
      <pre>
        <code>{`
          curl -X GET ${baseUrl}/api/questionnaires
        `}</code>
      </pre>
      <p>Get specific questionnaire by ID:</p>
      <pre>
        <code>{`
          curl -X GET "${baseUrl}/api/questionnaires?id=1"
        `}</code>
      </pre>
      <p>PowerShell Commands:</p>
      <pre>
        <code>{`
          # Get all questionnaires
          Invoke-RestMethod -Uri "${baseUrl}/api/questionnaires" -Method Get

          # Get specific questionnaire
          Invoke-RestMethod -Uri "${baseUrl}/api/questionnaires?id=1" -Method Get
        `}</code>
      </pre>

      <h3>2. POST Request - Create Questionnaire</h3>
      <p>Create a new questionnaire:</p>
      <pre>
        <code>{`
          curl -X POST ${baseUrl}/api/questionnaires \\
            -H "Content-Type: application/json" \\
            -d '{
              "timer": 120,
              "question": "What is React?",
              "expectedAnswer": "A JavaScript library for building user interfaces"
            }'
        `}</code>
      </pre>
      <p>PowerShell Command:</p>
      <pre>
        <code>{`
          $body = @{
            timer = 120
            question = "What is React?"
            expectedAnswer = "A JavaScript library for building user interfaces"
          } | ConvertTo-Json

          Invoke-RestMethod -Uri "${baseUrl}/api/questionnaires" -Method Post -ContentType "application/json" -Body $body
        `}</code>
      </pre>

      <h3>3. PATCH Request - Update Questionnaire</h3>
      <p>Update questionnaire information:</p>
      <pre>
        <code>{`
          curl -X PATCH "${baseUrl}/api/questionnaires?id=1" \\
            -H "Content-Type: application/json" \\
            -d '{
              "timer": 180,
              "question": "What is Next.js?",
              "expectedAnswer": "A React framework for production"
            }'
        `}</code>
      </pre>
      <p>PowerShell Command:</p>
      <pre>
        <code>{`
          $body = @{
            timer = 180
            question = "What is Next.js?"
            expectedAnswer = "A React framework for production"
          } | ConvertTo-Json

          Invoke-RestMethod -Uri "${baseUrl}/api/questionnaires?id=1" -Method Patch -ContentType "application/json" -Body $body
        `}</code>
      </pre>

      <h3>4. DELETE Request - Delete Questionnaire</h3>
      <p>Delete a questionnaire:</p>
      <pre>
        <code>{`
          curl -X DELETE "${baseUrl}/api/questionnaires?id=1"
        `}</code>
      </pre>
      <p>PowerShell Command:</p>
      <pre>
        <code>{`
          Invoke-RestMethod -Uri "${baseUrl}/api/questionnaires?id=1" -Method Delete
        `}</code>
      </pre>

      <h3>Response Examples</h3>
      <p><strong>Successful GET Response:</strong></p>
      <pre>
        <code>{`
          {
            "id": 1,
            "title": "What is React?",
            "timerCount": 120,
            "timerPaused": true,
            "background": null,
            "challenge1Question": "A JavaScript library for building user interfaces",
            "challenge1Code": "// Default code",
            "challenge2Prompt": "Default prompt",
            "createdAt": "2025-10-23T10:00:00.000Z",
            "updatedAt": "2025-10-23T10:00:00.000Z"
          }
        `}</code>
      </pre>

      <p><strong>Error Response:</strong></p>
      <pre>
        <code>{`
          HTTP 404: "Questionnaire not found"
          HTTP 400: "Missing timer, question or expectedAnswer"
          HTTP 500: "Server error"
        `}</code>
      </pre>
    </div>
  );
};

export default ApiDocumentation;