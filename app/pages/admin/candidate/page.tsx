"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import SidebarAdmin from "@/app/components/Sidebaradmin";
import { motion } from "framer-motion";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function JobApplicationsTable() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("/api/JobApplication");
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      await axios.delete(`/api/JobApplication/${id}`);
      setApplications(applications.filter((app) => app._id !== id));
      alert("✅ Application deleted successfully!");
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("❌ Failed to delete application.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-900">
      <SidebarAdmin />
      <div className="flex-1 p-8 ml-64">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 relative"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
            Job Applications Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Manage and review all candidate applications
          </p>
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-indigo-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-teal-300 rounded-full opacity-20 animate-pulse delay-200"></div>
        </motion.div>

        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-indigo-100 dark:border-indigo-800">
          <table className="min-w-full text-left">
            <thead className="bg-gradient-to-r from-indigo-50 to-teal-50 dark:from-gray-800 dark:to-teal-900 border-b border-indigo-200 dark:border-gray-700">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "CNIC",
                  "Address",
                  "Education",
                  "Last Salary",
                  "Expected Salary",
                  "Join Date",
                  "Position",
                  "Experience",
                  "References",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="p-4 text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-6 text-center text-gray-500 dark:text-gray-400">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <svg
                        className="h-16 w-16 mx-auto text-indigo-400 animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p className="mt-4 text-lg">No job applications found.</p>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                applications.map((app, index) => (
                  <motion.tr
                    key={app._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border-b border-indigo-100 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <td className="p-4 text-gray-800 dark:text-gray-200 font-medium">{app.name || "N/A"}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{app.email || "N/A"}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{app.phone || "N/A"}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{app.cnic || "N/A"}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{app.currentAddress || "N/A"}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{app.education || "N/A"}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{app.lastSalary || "N/A"}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{app.expectedSalary || "N/A"}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{app.joinDate || "N/A"}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 shadow-sm">
                        {app.position || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{app.experience || "N/A"}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{app.references || "N/A"}</td>
                    <td className="p-4 text-center">
                      <Button
                        onClick={() => handleDelete(app._id)}
                        className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-4 py-2 rounded-full shadow-md transition-all duration-300 flex items-center gap-2"
                      >
                        <TrashIcon className="h-5 w-5" />
                        Delete
                      </Button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}