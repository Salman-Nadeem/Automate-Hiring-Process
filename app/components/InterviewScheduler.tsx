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
// Generate available interview slots for the next 5 days at 10:00 AM and 2:00 PM.

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

    // Retrieve candidate details from sessionStorage
    const candidateEmail = sessionStorage.getItem("jobApplicantEmail") || "test@example.com";
    const candidateName = sessionStorage.getItem("jobApplicantName") || "John Doe";
    const candidatePosition = sessionStorage.getItem("jobApplicantPosition") || "Software Engineer";




    try {

      const requestBody = {
        candidateEmail : candidateEmail,
        candidateName :candidateName ,
        position: candidatePosition,
        interviewDate: selectedSlot,
      };
    
      console.log("🔍 Sending Data:", requestBody); // Debugging Purpose


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

  // If the interview has been scheduled, show the final screen.
  if (isScheduled) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Interview Scheduled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            <p className="font-bold">Congratulations!</p>
            <p>Your interview is scheduled for: {finalInterviewTime}</p>
            <p>Join link: <a href="https://meet.example.com/interview-123" className="underline">https://meet.example.com/interview-123</a></p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Otherwise, show the scheduling form.
  return (
    <Card className="w-full max-w-2xl mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Schedule Your Interview</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="mb-4">Please select an interview time:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableSlots.map((slot) => (
              <Button
                key={slot.id}
                type="button"
                variant={selectedSlot === format(slot.datetime, "PPpp") ? "default" : "outline"}
                className="w-full justify-start h-auto py-4 px-6"
                onClick={() => setSelectedSlot(format(slot.datetime, "PPpp"))}
              >
                {format(slot.datetime, "MMMM d, yyyy h:mm a")}
              </Button>
            ))}
          </div>
          <Button type="submit" className="w-full mt-6" disabled={!selectedSlot || loading}>
            {loading ? "Scheduling..." : "Confirm Interview Time"}
          </Button>
          {message && <p className="text-center text-red-500 mt-4">{message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
