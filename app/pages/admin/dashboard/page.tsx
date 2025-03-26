"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { CalendarIcon } from "@heroicons/react/24/outline";
import Sidebar from "@/app/components/Sidebaradmin";

export default function HiringDashboard() {
  const [interviewsData, setInterviewsData] = useState([]);

  useEffect(() => {
    axios
      .get("/api/Interview")
      .then((response) => {
        console.log("API Response:", response.data);
        setInterviewsData(response.data.interviews || []);
      })
      .catch((error) => {
        console.error("Error fetching interviews:", error);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="bg-white dark:bg-gray-850 rounded-2xl shadow-xl p-8 border border-indigo-100 dark:border-gray-700 transform transition-all duration-300">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Upcoming Interviews</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({interviewsData.length})</span>
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-b dark:border-gray-600">
                <tr>
                  {["Candidate Name", "Candidate Email", "Position", "Time", "Status"].map((header) => (
                    <th
                      key={header}
                      className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {interviewsData.length > 0 ? (
                  interviewsData.map((interview, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-750 transition-colors duration-200"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                          <span className="text-gray-800 dark:text-gray-200 font-medium">
                            {interview.candidateName || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{interview.candidateEmail || "N/A"}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 shadow-sm">
                          {interview.position || "N/A"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <CalendarIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                          <span className="text-sm font-medium">{interview.interviewDate || "N/A"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                            interview.status === "Confirmed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {interview.status || "Confirmed"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="h-12 w-12 text-gray-400 dark:text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-lg">No upcoming interviews scheduled.</span>
                      </div>
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