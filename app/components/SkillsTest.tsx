"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

export default function PostInterviewTest({ onComplete = () => {} }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600); // 10 min = 600 sec
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("/api/Question", { credentials: "include" });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); // Auto-submit test when timer reaches zero
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const finalScore = questions.reduce(
      (acc, q, index) => acc + (answers[index] === q.correctAnswer ? 1 : 0),
      0
    );
    const scorePercentage = (finalScore / questions.length) * 100;
    setScore(scorePercentage);
    setTestCompleted(true);
    onComplete(scorePercentage);
  };

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading questions...</div>;
  }

  if (questions.length === 0) {
    return <div className="text-center text-xl font-semibold">No questions available for your position.</div>;
  }

  if (testCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Card className="p-6 w-96 text-center shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold mb-4">Test Completed!</h2>
          <p className="text-lg font-semibold mb-2">Your Score: <span className="text-blue-600">{score.toFixed(2)}%</span></p>
          <p className="text-gray-600">Thank you for completing the test.</p>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <Card className="w-full max-w-xl shadow-lg border border-gray-200">
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Post-Interview Test</h2>
            <p className="text-red-500 font-bold">Time Left: {formatTime(timeLeft)}</p>
          </div>
          <p className="text-lg font-semibold">{currentQuestion + 1}. {question.question}</p>
          <RadioGroup value={answers[currentQuestion]} onValueChange={handleAnswer} className="space-y-3">
            {question.options.map((option) => (
              <div key={option} className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-100">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="w-full">{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <Button onClick={handleNext} disabled={!answers[currentQuestion]} className="w-full">
            {currentQuestion === questions.length - 1 ? "Submit Test" : "Next Question"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
