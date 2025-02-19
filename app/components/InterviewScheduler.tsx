"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, addDays, setHours, setMinutes } from "date-fns"

const generateAvailableSlots = () => {
  const slots = []
  const startDate = new Date()
  for (let i = 1; i <= 5; i++) {
    const date = addDays(startDate, i)
    slots.push(
      { id: `${format(date, "yyyy-MM-dd")}-10:00`, datetime: setHours(setMinutes(date, 0), 10) },
      { id: `${format(date, "yyyy-MM-dd")}-14:00`, datetime: setHours(setMinutes(date, 0), 14) },
    )
  }
  return slots
}

const availableSlots = generateAvailableSlots()

export default function InterviewScheduler({ onSchedule }: { onSchedule: (time: string) => void }) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSlot) {
      onSchedule(selectedSlot)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
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
          <Button type="submit" className="w-full mt-6" disabled={!selectedSlot}>
            Confirm Interview Time
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

