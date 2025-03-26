"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CurrencyDollarIcon,
  XMarkIcon,
  BriefcaseIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ClockIcon,
  MapPinIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  HomeIcon,
  GiftIcon,
  StarIcon,
  ShareIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const JobListingPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "all",
    jobType: "all",
    salaryRange: "all",
  });
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [timeLeft, setTimeLeft] = useState("");
  const [error, setError] = useState(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const jobsPerPage = 6;
  const router = useRouter();

  // Confetti trigger function (unchanged)
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#4F46E5", "#A855F7", "#3B82F6"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#4F46E5", "#A855F7", "#3B82F6"],
      });
    }, 250);
  };

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        const response = await axios.get("/api/jobs");
        const jobsData = Array.isArray(response.data) ? response.data : [];
        console.log("Fetched jobs:", jobsData);
        setJobs(jobsData);
        setFilteredJobs(jobsData);
        setError(null);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to load job listings. Please try again later.");
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();

    const savedJobsFromStorage = localStorage.getItem("savedJobs");
    if (savedJobsFromStorage) setSavedJobs(JSON.parse(savedJobsFromStorage));
  }, []);

  // Filter, search, and sort logic
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      let updatedJobs = [...jobs];

      // Filter by saved jobs if on saved tab
      if (activeTab === "saved") {
        updatedJobs = updatedJobs.filter((job) => savedJobs.includes(job.id));
      }

      // Search filter
      if (searchQuery) {
        updatedJobs = updatedJobs.filter((job) =>
          [
            job.title || "",
            job.company || "",
            job.description || "",
          ].some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      // Location filter
      if (filters.location && filters.location !== "all") {
        updatedJobs = updatedJobs.filter((job) =>
          job.location?.toLowerCase() === filters.location.toLowerCase()
        );
      }

      // Job type filter
      if (filters.jobType && filters.jobType !== "all") {
        updatedJobs = updatedJobs.filter((job) =>
          job.type?.toLowerCase() === filters.jobType.toLowerCase()
        );
      }

      // Salary range filter
      if (filters.salaryRange && filters.salaryRange !== "all") {
        const [min, max] = filters.salaryRange.split("-").map(Number);
        updatedJobs = updatedJobs.filter((job) => {
          const salaryStr = job.salary || "0";
          const salary = Number.parseInt(salaryStr.replace(/[^0-9]/g, "")) || 0;
          return salary >= min && (!max || salary <= max);
        });
      }

      // Sorting
      updatedJobs.sort((a, b) => {
        if (sortBy === "title") {
          return sortOrder === "asc"
            ? (a.title || "").localeCompare(b.title || "")
            : (b.title || "").localeCompare(a.title || "");
        } else if (sortBy === "company") {
          return sortOrder === "asc"
            ? (a.company || "").localeCompare(b.company || "")
            : (b.company || "").localeCompare(a.company || "");
        } else if (sortBy === "salary") {
          const salaryA = Number.parseInt(a.salary?.replace(/[^0-9]/g, "")) || 0;
          const salaryB = Number.parseInt(b.salary?.replace(/[^0-9]/g, "")) || 0;
          return sortOrder === "asc" ? salaryA - salaryB : salaryB - salaryA;
        } else if (sortBy === "deadline") {
          const dateA = new Date(a.applicationDeadline || "9999-12-31").getTime();
          const dateB = new Date(b.applicationDeadline || "9999-12-31").getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        }
        return 0;
      });

      setFilteredJobs(updatedJobs);
      setCurrentPage(1); // Reset to first page
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters, jobs, sortBy, sortOrder, savedJobs, activeTab]);

  // Timer logic for deadline countdown (unchanged)
  useEffect(() => {
    if (!selectedJob || !selectedJob.applicationDeadline) {
      setTimeLeft("N/A");
      return;
    }

    const calculateTimeLeft = () => {
      const deadline = new Date(selectedJob.applicationDeadline).getTime();
      const now = new Date().getTime();
      const difference = deadline - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h remaining`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m remaining`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s remaining`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [selectedJob]);

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

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
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case "part-time":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "contract":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "internship":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "freelance":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Toggle job saved status
  const toggleSaveJob = (e, jobId) => {
    e.stopPropagation();
    let updatedSavedJobs;
    if (savedJobs.includes(jobId)) {
      updatedSavedJobs = savedJobs.filter((id) => id !== jobId);
    } else {
      updatedSavedJobs = [...savedJobs, jobId];
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 }, colors: ["#4F46E5", "#A855F7", "#3B82F6"] });
    }
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs));
  };

  // Share job function (unchanged)
  const shareJob = (e, job) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href,
      }).catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard.writeText(`${job.title} at ${job.company}: ${window.location.href}`)
        .then(() => alert("Job link copied to clipboard!"))
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilters({ location: "all", jobType: "all", salaryRange: "all" });
    setSortBy("title");
    setSortOrder("asc");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Modal for Selected Job */}
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
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-indigo-200 dark:border-indigo-800 relative"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-t-2xl"></div>
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
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900"
                          onClick={(e) => toggleSaveJob(e, selectedJob.id)}
                        >
                          {savedJobs.includes(selectedJob.id) ? (
                            <StarIconSolid className="h-5 w-5 text-amber-500" />
                          ) : (
                            <StarIcon className="h-5 w-5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {savedJobs.includes(selectedJob.id) ? "Remove from saved" : "Save job"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900"
                          onClick={(e) => shareJob(e, selectedJob)}
                        >
                          <ShareIcon className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share job</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedJob(null)}
                    className="rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800"
                    aria-label="Close modal"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-6 text-gray-700 dark:text-gray-300">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Badge variant="outline" className={`${getJobTypeBadgeColor(selectedJob.type)} text-sm px-3 py-1`}>
                      <BriefcaseIcon className="h-4 w-4 mr-1.5" />
                      {selectedJob.type || "Not specified"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`${timeLeft === "Expired" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"} ${timeLeft === "Expired" ? "" : "animate-pulse"} text-sm px-3 py-1`}
                    >
                      <ClockIcon className="h-4 w-4 mr-1.5" />
                      {timeLeft}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPinIcon className="h-5 w-5 mr-3 text-indigo-500" />
                      <span>{selectedJob.location || "No Location"}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <CurrencyDollarIcon className="h-5 w-5 mr-3 text-green-600" />
                      <span className="font-medium">{formatSalary(selectedJob.salary)}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <AcademicCapIcon className="h-5 w-5 mr-3 text-indigo-500" />
                      <span>{selectedJob.education || "Not specified"}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <EnvelopeIcon className="h-5 w-5 mr-3 text-indigo-500" />
                      <span className="truncate">{selectedJob.contactEmail || "No contact provided"}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 col-span-2">
                      <HomeIcon className="h-5 w-5 mr-3 text-indigo-500" />
                      <span>{selectedJob.remoteWork ? "Remote available" : "On-site only"}</span>
                    </div>
                  </div>
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
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Job Description</h3>
                  <div className="bg-white dark:bg-gray-800/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {selectedJob.description || "No Description"}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Requirements</h3>
                  <div className="bg-white dark:bg-gray-800/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                      {selectedJob.requirements ? (
                        selectedJob.requirements.split("\n").map((req, index) => <li key={index}>{req.trim()}</li>)
                      ) : (
                        <li>No requirements specified</li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Responsibilities</h3>
                  <div className="bg-white dark:bg-gray-800/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                      {selectedJob.responsibilities ? (
                        selectedJob.responsibilities.split("\n").map((resp, index) => <li key={index}>{resp.trim()}</li>)
                      ) : (
                        <li>No responsibilities specified</li>
                      )}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/pages/hiring/?title=${encodeURIComponent(selectedJob.title)}`)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Discover Your Next Career Adventure
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Find the perfect job opportunity that matches your skills and aspirations
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="all" className="text-base">
                All Jobs
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-base">
                Saved Jobs
                {savedJobs.length > 0 && (
                  <Badge className="ml-2 bg-indigo-600 hover:bg-indigo-700">{savedJobs.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Search, Filters, and Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-900 sticky top-4 z-10"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400" />
                <Input
                  type="text"
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="whitespace-nowrap" onClick={() => setShowFilters(!showFilters)}>
                  {showFilters ? "Hide Filters" : "Show Filters"}
                  <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </Button>
                <Select value={sortBy} onValueChange={(value) => handleSort(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Sort by Title {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}</SelectItem>
                    <SelectItem value="company">Sort by Company {sortBy === "company" && (sortOrder === "asc" ? "↑" : "↓")}</SelectItem>
                    <SelectItem value="salary">Sort by Salary {sortBy === "salary" && (sortOrder === "asc" ? "↑" : "↓")}</SelectItem>
                    <SelectItem value="deadline">Sort by Deadline {sortBy === "deadline" && (sortOrder === "asc" ? "↑" : "↓")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800"
              >
                <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                    <SelectItem value="London">London</SelectItem>
                    <SelectItem value="San Francisco">San Francisco</SelectItem>
                    <SelectItem value="Berlin">Berlin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.jobType} onValueChange={(value) => setFilters({ ...filters, jobType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Job Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Job Types</SelectItem>
                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.salaryRange} onValueChange={(value) => setFilters({ ...filters, salaryRange: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Salaries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Salaries</SelectItem>
                    <SelectItem value="0-50000">$0 - $50,000</SelectItem>
                    <SelectItem value="50000-100000">$50,000 - $100,000</SelectItem>
                    <SelectItem value="100000-150000">$100,000 - $150,000</SelectItem>
                    <SelectItem value="150000-">$150,000+</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="sm:col-span-3" onClick={resetFilters}>
                  Reset All Filters
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-lg mb-8 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Job Listings */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden border border-indigo-100 dark:border-indigo-900">
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-10 w-1/3 rounded-md" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-12 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-indigo-100 dark:border-indigo-900"
          >
            <div className="flex justify-center mb-4">
              <MagnifyingGlassIcon className="h-16 w-16 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No jobs found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              {activeTab === "saved"
                ? "You haven't saved any jobs yet. Browse all jobs and click the star icon to save jobs for later."
                : "Try adjusting your search filters or try a different search term."}
            </p>
            <Button variant="outline" className="mr-2" onClick={resetFilters}>
              Clear all filters
            </Button>
            {activeTab === "saved" && (
              <Button onClick={() => setActiveTab("all")} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Browse All Jobs
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentJobs.map((job, index) => (
              <motion.div
                key={job.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-indigo-100 dark:border-indigo-900 h-full flex flex-col relative group"
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${job.company}&background=random`} />
                            <AvatarFallback>{job.company?.charAt(0) || "C"}</AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                            {job.title || "Untitled"}
                          </h3>
                        </div>
                        <p className="text-indigo-600 dark:text-indigo-400 font-medium">{job.company || "Unknown"}</p>
                      </div>
                      <Badge className={getJobTypeBadgeColor(job.type)}>{job.type || "Unspecified"}</Badge>
                    </div>
                    <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400 text-sm">
                      <MapPinIcon className="h-4 w-4 mr-2 text-indigo-500" />
                      {job.location || "Unknown location"}
                    </div>
                    {job.description && (
                      <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{job.description}</p>
                    )}
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 mr-1 text-green-600" />
                        <span className="text-green-600 dark:text-green-400 font-medium">{formatSalary(job.salary)}</span>
                      </div>
                      <div className="flex space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={(e) => toggleSaveJob(e, job.id)}
                              >
                                {savedJobs.includes(job.id) ? (
                                  <StarIconSolid className="h-4 w-4 text-amber-500" />
                                ) : (
                                  <StarIcon className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {savedJobs.includes(job.id) ? "Remove from saved" : "Save job"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={(e) => shareJob(e, job)}
                              >
                                <ShareIcon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Share job</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <Button
                      className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(job);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredJobs.length > jobsPerPage && (
          <div className="mt-10 flex justify-center gap-3 items-center">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageToShow;
                if (totalPages <= 5) {
                  pageToShow = i + 1;
                } else if (currentPage <= 3) {
                  pageToShow = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageToShow = totalPages - 4 + i;
                } else {
                  pageToShow = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageToShow}
                    onClick={() => handlePageChange(pageToShow)}
                    variant={currentPage === pageToShow ? "default" : "outline"}
                    className={currentPage === pageToShow ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                    aria-label={`Go to page ${pageToShow}`}
                    aria-current={currentPage === pageToShow ? "page" : undefined}
                  >
                    {pageToShow}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        )}

        {/* Floating Action Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 z-10"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default JobListingPage;