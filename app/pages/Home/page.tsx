"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Router import karo
import { BuildingOfficeIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const JobListingPage = () => {
  const [jobs, setJobs] = useState([]);
  const router = useRouter(); // ✅ Router initialize karo

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Find Your Dream Job</h1>

      <div className="grid gap-6 max-w-3xl mx-auto">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                <div className="flex items-center gap-2 mt-1 text-gray-600">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
                  <span>{job.company}</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{job.type}</span>
            </div>

            <div className="mt-3 flex items-center gap-4 text-gray-700">
              <div className="flex items-center gap-1">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                <span className="font-medium">{job.salary}</span>
              </div>
              <span className="text-gray-500">•</span>
              <span>{job.location}</span>
            </div>

            <button
              onClick={() => router.push(`/pages/hiring/?title=${encodeURIComponent(job.title)}`)} 
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobListingPage;
