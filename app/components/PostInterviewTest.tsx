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
      handleSubmit();
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-indigo-600 animate-pulse">Loading Your Challenge...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-purple-600">No Challenges Available Today!</div>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl rounded-3xl overflow-hidden bg-white/95 backdrop-blur-sm border border-indigo-100">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
            <h2 className="text-3xl font-bold text-white tracking-wide">Test Completed!</h2>
          </div>
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-lg font-semibold text-gray-700">
              Your Score: <span className={`text-3xl ${score >= 60 ? "text-green-600" : "text-red-600"}`}>{score.toFixed(2)}%</span>
            </p>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                <div
                  style={{ width: `${score}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-out ${
                    score >= 60 ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
              </div>
            </div>
            <p className="text-gray-600 italic">Thank you for showcasing your skills!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm border border-purple-100">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Post-Interview Challenge</h2>
          <div className="text-white font-bold text-lg">
            <span className="inline-block px-3 py-1 bg-red-500/20 rounded-full">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold rounded-full">
              {currentQuestion + 1}
            </span>
            <p className="text-lg font-semibold text-gray-800">{question.question}</p>
          </div>
          <RadioGroup value={answers[currentQuestion]} onValueChange={handleAnswer} className="space-y-3">
            {question.options.map((option) => (
              <div
                key={option}
                className={`flex items-center space-x-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  answers[currentQuestion] === option
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <RadioGroupItem value={option} id={option} className="text-indigo-600" />
                <Label htmlFor={option} className="w-full text-gray-700 font-medium">{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion]}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === questions.length - 1 ? "Submit Challenge" : "Next Question"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}