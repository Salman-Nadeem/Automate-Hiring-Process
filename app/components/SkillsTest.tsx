"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    question: "Which programming language is React built with?",
    options: ["Java", "Python", "JavaScript", "C++"],
    correctAnswer: "JavaScript",
  },
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language",
    ],
    correctAnswer: "Hyper Text Markup Language",
  },
  {
    question: "What is the primary purpose of a firewall in network security?",
    options: ["Virus scanning", "Traffic filtering", "Data encryption", "User authentication"],
    correctAnswer: "Traffic filtering",
  },
  {
    question: "Which of the following is not a valid HTTP status code?",
    options: ["200 OK", "404 Not Found", "500 Internal Server Error", "600 Server Busy"],
    correctAnswer: "600 Server Busy",
  },
]

export default function SkillsTest({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [isTestOver, setIsTestOver] = useState(false)

  useEffect(() => {
    if (timeLeft > 0 && !isTestOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isTestOver) {
      setIsTestOver(true)
    }
  }, [timeLeft, isTestOver])

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: answer }))
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setIsTestOver(true)
    }
  }

  const calculateScore = () => {
    const score = questions.reduce((acc, q, index) => {
      return acc + (answers[index] === q.correctAnswer ? 1 : 0)
    }, 0)
    return (score / questions.length) * 100
  }

  if (isTestOver) {
    const score = calculateScore()
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Test Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl mb-4">Your score: {score.toFixed(2)}%</p>
          <Button onClick={() => onComplete(score)} className="w-full">
            View Results
          </Button>
        </CardContent>
      </Card>
    )
  }

  const question = questions[currentQuestion]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Skills Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p>
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p>
            Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </p>
        </div>
        <Progress value={(timeLeft / 600) * 100} className="w-full" />
        <p className="text-lg font-semibold mt-4">{question.question}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {question.options.map((option) => (
            <Button
              key={option}
              onClick={() => handleAnswer(option)}
              variant="outline"
              className="w-full text-left justify-start h-auto py-4 px-6"
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

