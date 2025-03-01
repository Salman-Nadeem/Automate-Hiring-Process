"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { BuildingOfficeIcon, CurrencyDollarIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import SidebarAdmin from "@/app/components/Sidebaradmin";

const JobListingPageAdmin = () => {
  const [jobs, setJobs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("/api/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  const handleDelete = async (id) => {
    if (!id) {
      console.error("❌ Job ID is undefined or null.");
      return;
    }
  
    console.log("🛠️ Sending DELETE request for Job ID:", id); // Debugging ke liye
  
    if (!confirm("Are you sure you want to delete this job?")) return;
  
    try {
      const response = await axios.delete(`/api/jobs/${id}`);
  
      if (response.status === 200) {
        alert("✅ Job deleted successfully!");
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
      } else {
        alert("❌ Failed to delete job.");
      }
    } catch (error) {
      console.error("🔥 Error deleting job:", error.response?.data || error);
      alert("❌ Server error while deleting job.");
    }
  };
  return (
    <>
      <SidebarAdmin />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">All Jobs</h1>

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

              <div className="mt-4 flex justify-between">
                <button onClick={() => handleDelete(job._id)} className="bg-red-600 text-white px-4 py-2 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default JobListingPageAdmin;
