"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addDays, setHours, setMinutes } from "date-fns";

const generateAvailableSlots = () => {
  const slots = [];
  const startDate = new Date();
  for (let i = 1; i <= 5; i++) {
    const date = addDays(startDate, i);
    const slotBase = setMinutes(date, 0);
    slots.push(
      { id: `${date.toISOString()}-10:00`, datetime: setHours(slotBase, 10) },
      { id: `${date.toISOString()}-14:00`, datetime: setHours(slotBase, 14) }
    );
  }
  return slots;
};

const availableSlots = generateAvailableSlots();

export default function InterviewScheduler() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [finalInterviewTime, setFinalInterviewTime] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setLoading(true);
    setMessage("");

    const candidateEmail = sessionStorage.getItem("jobApplicantEmail") || "test@example.com";
    const candidateName = sessionStorage.getItem("jobApplicantName") || "John Doe";
    const candidatePosition = sessionStorage.getItem("jobApplicantPosition") || "Software Engineer";

    try {
      const requestBody = {
        candidateEmail: candidateEmail,
        candidateName: candidateName,
        position: candidatePosition,
        interviewDate: selectedSlot,
      };

      console.log("🔍 Sending Data:", requestBody);

      const response = await fetch("/api/Interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Interview scheduled successfully!");
        setFinalInterviewTime(selectedSlot);
        setIsScheduled(true);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage("❌ Failed to schedule interview.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isScheduled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl rounded-3xl overflow-hidden bg-white/95 backdrop-blur-sm border border-teal-100">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-indigo-500 p-6">
            <CardTitle className="text-3xl font-bold text-white tracking-wide">Interview Scheduled!</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gradient-to-r from-green-100 to-teal-100 border-l-4 border-green-500 text-green-700 p-6 rounded-xl space-y-3">
              <p className="font-bold text-lg">Congratulations!</p>
              <p>
                Your interview is set for: <span className="font-semibold text-teal-800">{finalInterviewTime}</span>
              </p>
              <p>
                Join link:{" "}
                <a
                  href="https://meet.example.com/interview-123"
                  className="underline text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  https://meet.example.com/interview-123
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm border border-indigo-100">
        <CardHeader className="bg-gradient-to-r from-teal-500 to-indigo-500 p-6">
          <CardTitle className="text-3xl font-bold text-white tracking-wide">Pick Your Interview Slot</CardTitle>
          <p className="text-teal-100 mt-2">Secure your spot for the next step!</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-gray-700 text-lg">Choose a convenient time:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSlots.map((slot) => {
                const formattedSlot = format(slot.datetime, "PPpp");
                const isSelected = selectedSlot === formattedSlot;
                return (
                  <Button
                    key={slot.id}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full justify-start h-auto py-4 px-6 rounded-xl transition-all duration-300 ${
                      isSelected
                        ? "bg-gradient-to-r from-teal-500 to-indigo-500 text-white shadow-md"
                        : "border-2 border-indigo-200 hover:bg-indigo-50 text-gray-700"
                    }`}
                    onClick={() => setSelectedSlot(formattedSlot)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{format(slot.datetime, "MMMM d, yyyy")}</span>
                      <span className="text-sm">{format(slot.datetime, "h:mm a")}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedSlot || loading}
            >
              {loading ? "Scheduling..." : "Lock in My Interview"}
            </Button>
            {message && (
              <p
                className={`text-center text-lg mt-4 ${
                  message.includes("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}