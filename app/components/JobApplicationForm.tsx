"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JobApplicationForm({ onSubmit }) {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cnic: "",
    currentAddress: "",
    education: "",
    lastSalary: "",
    expectedSalary: "",
    joinDate: "",
    whyHireYou: "",
    position: "",
    experience: "",
    references: "",
    cv: null,
  });

  useEffect(() => {
    const pos = searchParams.get("title") || "";
    setFormData((prevData) => ({ ...prevData, position: pos }));
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, cv: e.target.files[0] }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Please enter your full name.");
      return false;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Please enter a valid phone number (at least 10 digits).");
      return false;
    }
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicRegex.test(formData.cnic)) {
      alert("Please enter a valid CNIC (format: 12345-1234567-1).");
      return false;
    }
    if (!formData.currentAddress.trim()) {
      alert("Please enter your current address.");
      return false;
    }
    if (!formData.education.trim()) {
      alert("Please enter your education details.");
      return false;
    }
    if (!formData.lastSalary || isNaN(formData.lastSalary) || Number(formData.lastSalary) <= 0) {
      alert("Please enter a valid last salary.");
      return false;
    }
    if (!formData.expectedSalary || isNaN(formData.expectedSalary) || Number(formData.expectedSalary) <= 0) {
      alert("Please enter a valid expected salary.");
      return false;
    }
    if (!formData.joinDate) {
      alert("Please select a join date.");
      return false;
    }
    if (!formData.whyHireYou.trim()) {
      alert("Please tell us why we should hire you.");
      return false;
    }
    if (!formData.position) {
      alert("Position is required (should be provided in URL).");
      return false;
    }
    if (!formData.experience.trim()) {
      alert("Please provide details about your work experience.");
      return false;
    }
    if (!formData.references.trim()) {
      alert("Please provide references.");
      return false;
    }
    if (!formData.cv) {
      alert("Please upload your CV.");
      return false;
    } else if (formData.cv.type !== "application/pdf") {
      alert("CV must be a PDF file.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    document.cookie = `jobApplicantName=${encodeURIComponent(formData.name)}; path=/;`;
    document.cookie = `jobApplicantEmail=${encodeURIComponent(formData.email)}; path=/;`;
    document.cookie = `jobApplicantPosition=${encodeURIComponent(formData.position)}; path=/;`;
    sessionStorage.setItem("jobApplicantName", formData.name);
    sessionStorage.setItem("jobApplicantEmail", formData.email);
    sessionStorage.setItem("jobApplicantPosition", formData.position);
    if (onSubmit) {
      onSubmit(formData);
    }
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "cv" && value) {
        data.append(key, value);
      } else {
        data.append(key, value);
      }
    });
    const posParam = searchParams.get("title") || "";
    data.set("position", posParam);
    try {
      const response = await axios.post("/api/JobApplication", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Success:", response.data);
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 py-12 px-4">
      <Card className="w-full max-w-4xl mx-auto border-none shadow-2xl rounded-3xl overflow-hidden bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 p-8 relative">
          <CardTitle className="text-4xl font-extrabold text-white text-center tracking-wide">
            Launch Your Career
          </CardTitle>
          <p className="text-center text-purple-100 mt-2 font-light">Apply for: {formData.position || "Your Dream Job"}</p>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="space-y-1">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>Full Name
                </Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 placeholder:text-gray-400"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>Email
                </Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className="rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 placeholder:text-gray-400"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full"></span>Phone
                </Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                  className="rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300 placeholder:text-gray-400"
                  placeholder="+1234567890"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cnic" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>CNIC
                </Label>
                <Input 
                  id="cnic" 
                  name="cnic" 
                  value={formData.cnic} 
                  onChange={handleChange} 
                  required 
                  className="rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 placeholder:text-gray-400"
                  placeholder="12345-1234567-1"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="currentAddress" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>Current Address
                </Label>
                <Textarea 
                  id="currentAddress" 
                  name="currentAddress" 
                  value={formData.currentAddress} 
                  onChange={handleChange} 
                  required 
                  className="rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 min-h-[120px] transition-all duration-300 placeholder:text-gray-400"
                  placeholder="Your complete address"
                />
              </div>

              {/* Professional Details */}
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="education" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full"></span>Education
                </Label>
                <Textarea 
                  id="education" 
                  name="education" 
                  value={formData.education} 
                  onChange={handleChange} 
                  required 
                  className="rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:ring-teal-500 min-h-[120px] transition-all duration-300 placeholder:text-gray-400"
                  placeholder="Your educational background"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastSalary" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>Last Salary
                </Label>
                <Input 
                  id="lastSalary" 
                  name="lastSalary" 
                  type="number" 
                  value={formData.lastSalary} 
                  onChange={handleChange} 
                  required 
                  className="rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 placeholder:text-gray-400"
                  placeholder="50000"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="expectedSalary" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>Expected Salary
                </Label>
                <Input 
                  id="expectedSalary" 
                  name="expectedSalary" 
                  type="number" 
                  value={formData.expectedSalary} 
                  onChange={handleChange} 
                  required 
                  className="rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 placeholder:text-gray-400"
                  placeholder="60000"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="joinDate" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full"></span>Join Date
                </Label>
                <Input 
                  id="joinDate" 
                  name="joinDate" 
                  type="date" 
                  value={formData.joinDate} 
                  onChange={handleChange} 
                  required 
                  className="rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="position" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>Position
                </Label>
                <Input 
                  id="position" 
                  name="position" 
                  value={formData.position || ""} 
                  readOnly 
                  className="rounded-xl border-2 border-purple-200 bg-purple-50 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="experience" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>Experience
                </Label>
                <Textarea 
                  id="experience" 
                  name="experience" 
                  value={formData.experience} 
                  onChange={handleChange} 
                  required 
                  className="rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 min-h-[150px] transition-all duration-300 placeholder:text-gray-400"
                  placeholder="Describe your work experience"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="whyHireYou" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full"></span>Why Hire You?
                </Label>
                <Textarea 
                  id="whyHireYou" 
                  name="whyHireYou" 
                  value={formData.whyHireYou} 
                  onChange={handleChange} 
                  required 
                  className="rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:ring-teal-500 min-h-[150px] transition-all duration-300 placeholder:text-gray-400"
                  placeholder="What makes you stand out?"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="references" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>References
                </Label>
                <Textarea 
                  id="references" 
                  name="references" 
                  value={formData.references} 
                  onChange={handleChange} 
                  required 
                  className="rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 min-h-[120px] transition-all duration-300 placeholder:text-gray-400"
                  placeholder="Professional references"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="cv" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>Upload CV (PDF)
                </Label>
                <Input 
                  id="cv" 
                  name="cv" 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  required 
                  className="rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 file:bg-blue-100 file:border-0 file:rounded-xl file:px-4 file:py-2 file:text-blue-700 file:font-semibold hover:file:bg-blue-200 transition-all duration-300"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Submit Your Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}