"use client";

import { useState, useEffect } from "react";
import JobApplicationForm from "./JobApplicationForm";
import SkillsTest from "./SkillsTest";
import InterviewScheduler from "./InterviewScheduler";
import ConfettiAnimation from "./ConfettiAnimation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Helper function to get a cookie value by name
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function HiringSystem() {
  const [step, setStep] = useState(1);
  const [applicationData, setApplicationData] = useState(null);
  const [testScore, setTestScore] = useState<number | null>(null);
  const [interviewTime, setInterviewTime] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);

  // Candidate info from cookies (name & email)
  const [candidateInfo, setCandidateInfo] = useState({ name: "", email: "" });

  useEffect(() => {
    // Retrieve candidate info from cookies
    const nameCookie = getCookie("jobApplicantName") || "";
    const emailCookie = getCookie("jobApplicantEmail") || "";
    setCandidateInfo({ name: nameCookie, email: emailCookie });
  }, []);

  const handleApplicationSubmit = (data: any) => {
    setApplicationData(data);
    setStep(2);
  };

  const handleStartTest = () => {
    setStep(3);
  };

  const handleTestComplete = (score: number) => {
    setTestScore(score);
    setStep(4);
  };

  const handleShowScheduler = () => {
    setShowScheduler(true);
  };

  const handleInterviewScheduled = (time: string) => {
    setInterviewTime(time);
    setShowScheduler(false);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setStep(5);
    }, 5000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Comprehensive Hiring System</h1>

      {step === 1 && <JobApplicationForm onSubmit={handleApplicationSubmit} />}

      {step === 2 && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            {candidateInfo.name && (
              <div className="mb-4 p-6 border rounded shadow-sm bg-blue-50">
                <h2 className="text-2xl font-bold text-blue-800">Welcome, {candidateInfo.name}!</h2>
                <p className="text-lg text-blue-600">We're excited to have you in our Hiring System.</p>
              </div>
            )}
            <CardTitle className="text-2xl font-bold">Skills Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This will be a 10-minute test including various questions. Ready?</p>
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
            {testScore !== null && (
              <p className={`font-bold ${testScore < 40 ? "text-red-500" : "text-green-500"}`}>
                {testScore < 40
                  ? `Sorry, ${candidateInfo.name || "Candidate"}, you have failed the test. Your score: ${testScore}%`
                  : `Congratulations, ${candidateInfo.name || "Candidate"}! You passed with a score of ${testScore}%.`}
              </p>
            )}

            {testScore !== null && testScore >= 40 && !showScheduler && !interviewTime && (
              <Button onClick={handleShowScheduler}>Schedule Interview</Button>
            )}

            {showScheduler && <InterviewScheduler onSchedule={handleInterviewScheduled} />}
          </CardContent>
        </Card>
      )}

      {step === 5 && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Interview Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
              <p className="font-bold">Congratulations, {candidateInfo.name || "Candidate"}!</p>
              <p>Your interview is scheduled for: {interviewTime}</p>
              <p>
                Join link: <a href="https://meet.example.com/interview-123" className="underline">https://meet.example.com/interview-123</a>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <ConfettiAnimation />
        </div>
      )}
    </div>
  );
}
