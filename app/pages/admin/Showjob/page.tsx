"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  XMarkIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  HomeIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SidebarAdmin from "@/app/components/Sidebaradmin";

const JobListingPageAdmin = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate loading
        const response = await axios.get("/api/jobs");

        const jobsData = Array.isArray(response.data) ? response.data : [];
        console.log("Fetched jobs:", jobsData);

        setJobs(jobsData);
        setError(null);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to load job listings. Please try again later.");
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Format salary for display
  const formatSalary = (salary) => {
    if (!salary) return "Salary not specified";
    if (salary.includes("$") || salary.includes("€") || salary.includes("£")) return salary;
    const numericSalary = Number.parseInt(salary.replace(/[^0-9]/g, "")) || 0;
    return numericSalary > 0 ? `$${numericSalary.toLocaleString()}` : "Salary not specified";
  };

  // Get badge color based on job type
  const getJobTypeBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "full-time":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      case "part-time":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "contract":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "internship":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "freelance":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <>
      <SidebarAdmin />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-900 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Creative Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16 relative"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
              All Jobs
            </h1>
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-indigo-300 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-teal-300 rounded-full opacity-20 animate-pulse delay-200"></div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-6 rounded-xl mb-10 text-center shadow-md"
            >
              {error}
            </motion.div>
          )}

          {/* Job Listings */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="overflow-hidden border border-indigo-100 dark:border-indigo-900 shadow-lg rounded-2xl">
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-5 w-1/4 rounded-md" />
                      <Skeleton className="h-5 w-1/3 rounded-md" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-12 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-indigo-100 dark:border-indigo-900"
            >
              <div className="flex justify-center mb-6">
                <BriefcaseIcon className="h-16 w-16 text-indigo-400 animate-bounce" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No Jobs Available</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                It looks like there are no job listings right now. Check back soon for new opportunities!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                  onClick={() => setSelectedJob(job)}
                >
                  <Card
                    className="overflow-hidden shadow-xl rounded-2xl border border-indigo-100 dark:border-indigo-900 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm h-full flex flex-col relative group cursor-pointer"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-teal-300 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>

                    <div className="p-6 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-indigo-200 dark:border-indigo-700 shadow-sm">
                              <AvatarImage src={`https://ui-avatars.com/api/?name=${job.company}&background=random`} />
                              <AvatarFallback>{job.company?.charAt(0) || "C"}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                              {job.title || "Untitled Job"}
                            </h3>
                          </div>
                          <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{job.company || "Unknown"}</p>
                        </div>
                        <Badge className={`${getJobTypeBadgeColor(job.type)} px-3 py-1 text-sm shadow-sm`}>
                          <BriefcaseIcon className="h-4 w-4 mr-1.5" />
                          {job.type || "Unspecified"}
                        </Badge>
                      </div>

                      <div className="space-y-3 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <MapPinIcon className="h-5 w-5 mr-2 text-indigo-500" />
                          <span className="text-sm">{job.location || "Location not specified"}</span>
                        </div>
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
                          <span className="text-sm font-medium">{formatSalary(job.salary)}</span>
                        </div>
                      </div>

                      {job.description && (
                        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm line-clamp-3 italic">
                          {job.description}
                        </p>
                      )}

                      <div className="mt-auto pt-4">
                        <div className="h-1 w-1/4 bg-gradient-to-r from-indigo-400 to-teal-400 rounded-full mx-auto"></div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Job Popup */}
          <AnimatePresence>
            {selectedJob && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-indigo-200 dark:border-indigo-800 relative"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 rounded-t-2xl"></div>
                  <div className="p-6 bg-indigo-50 dark:bg-indigo-950/50 rounded-t-2xl flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800 shadow-md">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${selectedJob.company}&background=random`} />
                        <AvatarFallback>{selectedJob.company?.charAt(0) || "C"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                          {selectedJob.title || "No Title"}
                        </h2>
                        <p className="text-indigo-600 dark:text-indigo-400">{selectedJob.company || "No Company"}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="p-2 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 text-gray-700 dark:text-gray-300"
                      aria-label="Close popup"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="p-6 space-y-6 text-gray-700 dark:text-gray-300">
                    <div className="grid grid-cols-1 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center">
                        <BriefcaseIcon className="h-5 w-5 mr-3 text-indigo-500" />
                        <Badge className={`${getJobTypeBadgeColor(selectedJob.type)} px-2 py-1`}>
                          {selectedJob.type || "Not specified"}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-3 text-indigo-500" />
                        <span>{selectedJob.location || "No Location"}</span>
                      </div>
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-5 w-5 mr-3 text-green-600" />
                        <span className="font-medium">{formatSalary(selectedJob.salary)}</span>
                      </div>
                      <div className="flex items-center">
                        <AcademicCapIcon className="h-5 w-5 mr-3 text-indigo-500" />
                        <span>{selectedJob.education || "Education not specified"}</span>
                      </div>
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-5 w-5 mr-3 text-indigo-500" />
                        <span className="truncate">{selectedJob.contactEmail || "No contact email"}</span>
                      </div>
                      <div className="flex items-center">
                        <HomeIcon className="h-5 w-5 mr-3 text-indigo-500" />
                        <span>{selectedJob.remoteWork ? "Remote available" : "On-site only"}</span>
                      </div>
                    </div>

                    {selectedJob.description && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Description</h3>
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line bg-white dark:bg-gray-800/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                          {selectedJob.description}
                        </p>
                      </div>
                    )}

                    {selectedJob.requirements && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Requirements</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                          {selectedJob.requirements.split("\n").map((req, index) => (
                            <li key={index}>{req.trim() || "N/A"}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedJob.responsibilities && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Responsibilities</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                          {selectedJob.responsibilities.split("\n").map((resp, index) => (
                            <li key={index}>{resp.trim() || "N/A"}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedJob.benefits && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <GiftIcon className="h-5 w-5 mr-2 text-indigo-500" />
                          Benefits
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.benefits.split(",").map((benefit, index) => (
                            <Badge key={index} variant="secondary" className="text-xs py-1">
                              {benefit.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default JobListingPageAdmin;