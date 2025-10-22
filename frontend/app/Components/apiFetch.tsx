// fetch api to manage questions with timer, question text, and expected answers

'use client'
  import { useEffect, useState } from 'react';
  
  const APIURL = "http://ec2-52-87-169-227.compute-1.amazonaws.com:4080"; // replace with ec2 instance ip later
    export interface Question {
    id: number;
    timer: number;
    question: string;
    expectedAnswers: string[];
  }
    export default function QuestionManager() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState('');
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${APIURL}/api/questions`);
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    useEffect(() => {
      fetchQuestions();
    }, []);
    const updateTimer = async (id: number, newTimer: number) => {
      const current = questions.find((q) => q.id === id);
      if (!current) return;
  
      const res = await fetch(`${APIURL}/api/questions?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...current, timer: newTimer }),
      });
  
      if (res.ok) {
        fetchQuestions(); // 🔁 Refetch after update
      }
    };
    const addQuestion = async (timer: number, questionText: string, expectedAnswers: string[]) => {
      if (!questionText) return;

      const res = await fetch(`${APIURL}/api/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timer, question: questionText, expectedAnswers }),
      });

      if (res.ok) {
        setNewQuestion('');
        fetchQuestions(); // 🔁 Refetch after adding
      }
    };
    const deleteQuestion = async (id: number) => {
      const res = await fetch(`${APIURL}/api/questions?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchQuestions(); // 🔁 Refetch after delete
      }
    };

    return {
      questions,
      newQuestion,
      setNewQuestion,
      fetchQuestions,
      updateTimer,
      addQuestion,
      deleteQuestion
    };
  }