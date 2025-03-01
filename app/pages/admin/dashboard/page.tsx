// app/hiring-dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { CalendarIcon } from "@heroicons/react/24/outline";
import Sidebar from '@/app/components/Sidebaradmin';

export default function HiringDashboard() {
  const [interviewsData, setInterviewsData] = useState([]);

  useEffect(() => {
    axios.get("/api/Interview")
      .then((response) => {
        console.log("API Response:", response.data); // Debugging
        setInterviewsData(response.data.interviews);
      })
      .catch((error) => {
        console.error("Error fetching interviews:", error);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 dark:text-white">Upcoming Interviews</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b dark:border-gray-700">
                <tr>
                  {["Candidate Name", "Candidate Email", "Position", "Time", "Status"].map((header) => (
                    <th
                      key={header}
                      className="text-left p-3 text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {interviewsData.map((interview, index) => (
                  <tr
                    key={index}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-3">{interview.candidateName || "N/A"}</td>
                    <td className="p-3">{interview.candidateEmail || "N/A"}</td>
                    <td className="p-3">
                      <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        {interview.position || "N/A"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{interview.interviewDate || "N/A"}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          interview.status === "Confirmed"
                            ? "bg-green-100 text-green-600"
                          : "bg-green-100 text-green-600"
                        }`}
                      >
                        {interview.status || "Confrimed"}
                      </span>
                    </td>
                  </tr>
                ))}
                {interviewsData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-3 text-center text-gray-500">
                      No upcoming interviews.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
