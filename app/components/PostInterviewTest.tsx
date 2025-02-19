import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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
]

export default function PostInterviewTest({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: answer }))
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handleSubmit = () => {
    const score = questions.reduce((acc, q, index) => {
      return acc + (answers[index] === q.correctAnswer ? 1 : 0)
    }, 0)
    onComplete((score / questions.length) * 100)
  }

  const question = questions[currentQuestion]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Post-Interview Test</h2>
      <p className="mb-4">
        Question {currentQuestion + 1} of {questions.length}
      </p>
      <p className="font-semibold mb-2">{question.question}</p>
      <RadioGroup value={answers[currentQuestion]} onValueChange={handleAnswer}>
        {question.options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
      {currentQuestion === questions.length - 1 && <Button onClick={handleSubmit}>Submit Test</Button>}
    </div>
  )
}

