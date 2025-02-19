"use client"

import React, { useState } from "react"
import JobApplicationForm from "./JobApplicationForm"
import SkillsTest from "./SkillsTest"
import InterviewScheduler from "./InterviewScheduler"
import ConfettiAnimation from "./ConfettiAnimation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HiringSystem() {
  const [step, setStep] = useState(1)
  const [applicationData, setApplicationData] = useState(null)
  const [testScore, setTestScore] = useState<number | null>(null)
  const [interviewTime, setInterviewTime] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showScheduler, setShowScheduler] = useState(false)

  const handleApplicationSubmit = (data: any) => {
    setApplicationData(data)
    setStep(2)
  }

  const handleStartTest = () => {
    setStep(3)
  }

  const handleTestComplete = (score: number) => {
    setTestScore(score)
    setStep(4)
  }

  const handleShowScheduler = () => {
    setShowScheduler(true)
  }

  const handleInterviewScheduled = (time: string) => {
    setInterviewTime(time)
    setShowScheduler(false)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 5000) // Hide confetti after 5 seconds
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Comprehensive Hiring System</h1>
      {step === 1 && <JobApplicationForm onSubmit={handleApplicationSubmit} />}
      {step === 2 && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Skills Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This will be a test of 10 minutes which will include various questions to test your skills. Are you ready
              to begin?
            </p>
            <Button onClick={handleStartTest}>Start Test</Button>
          </CardContent>
        </Card>
      )}
      {step === 3 && <SkillsTest onComplete={handleTestComplete} />}
      {step === 4 && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-lg">Your test score: {testScore}%</p>
            {!showScheduler && !interviewTime && <Button onClick={handleShowScheduler}>Schedule Interview</Button>}
            {showScheduler && <InterviewScheduler onSchedule={handleInterviewScheduled} />}
            {interviewTime && (
              <div className="mt-4">
                {showConfetti && <ConfettiAnimation />}
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                  <p className="font-bold">Congratulations!</p>
                  <p>Your interview is scheduled for: {interviewTime}</p>
                  <p>Join link: https://meet.example.com/interview-123</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

