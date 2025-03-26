"use client";

import { useState, useEffect } from "react";
import JobApplicationForm from "./JobApplicationForm";
import SkillsTest from "./SkillsTest";
import InterviewScheduler from "./InterviewScheduler";
import ConfettiAnimation from "./ConfettiAnimation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const [candidateInfo, setCandidateInfo] = useState({ name: "", email: "" });

  useEffect(() => {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        Your Journey to Success
      </h1>

      {/* Step 1: Job Application Form */}
      {step === 1 && <JobApplicationForm onSubmit={handleApplicationSubmit} />}

      {/* Step 2: Skills Test Intro */}
      {step === 2 && (
        <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm border border-indigo-100">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
            {candidateInfo.name && (
              <div className="mb-4 p-4 rounded-xl bg-white/20 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-white">Welcome, {candidateInfo.name}!</h2>
                <p className="text-indigo-100">Your journey with us begins now!</p>
              </div>
            )}
            <CardTitle className="text-2xl font-bold text-white">Skills Assessment</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-6 text-gray-700 text-lg">Ready for a quick 10-minute challenge to showcase your skills?</p>
            <Button 
              onClick={handleStartTest} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Begin Assessment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Skills Test */}
      {step === 3 && <SkillsTest onComplete={handleTestComplete} />}

      {/* Step 4: Test Results */}
      {step === 4 && (
        <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm border border-purple-100">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
            <CardTitle className="text-2xl font-bold text-white">Your Results</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {testScore !== null ? (
              <div className="text-center">
                <p className={`text-2xl font-bold mb-4 ${testScore < 40 ? "text-red-600" : "text-green-600"}`}>
                  {testScore < 40
                    ? `Sorry, ${candidateInfo.name || "Candidate"}, you scored ${testScore}%`
                    : `Well Done, ${candidateInfo.name || "Candidate"}! Your score: ${testScore}%`}
                </p>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-xl bg-gray-200">
                    <div
                      style={{ width: `${testScore}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        testScore < 40 ? "bg-red-500" : "bg-green-500"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">Loading your results...</p>
            )}

            {testScore !== null && testScore >= 75 && !showScheduler && !interviewTime && (
              <Button 
                onClick={handleShowScheduler} 
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Schedule Your Interview
              </Button>
            )}

            {showScheduler && <InterviewScheduler onSchedule={handleInterviewScheduled} />}
          </CardContent>
        </Card>
      )}

      {/* Step 5: Interview Confirmation */}
      {step === 5 && (
        <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm border border-pink-100">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-indigo-500 p-6">
            <CardTitle className="text-2xl font-bold text-white">Interview Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gradient-to-r from-green-100 to-teal-100 border-l-4 border-green-500 text-green-700 p-6 rounded-xl">
              <p className="font-bold text-lg">Congratulations, {candidateInfo.name || "Candidate"}!</p>
              <p className="mt-2">Interview Scheduled: <span className="font-semibold">{interviewTime}</span></p>
        
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <ConfettiAnimation />
        </div>
      )}
    </div>
  );
}