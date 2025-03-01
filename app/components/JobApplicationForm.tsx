"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Get URL params
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
    position: "", // Will be set from URL param
    experience: "",
    references: "",
    cv: null,
  });

  // Set the position from URL param on mount
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

    // Set cookies
    document.cookie = `jobApplicantName=${encodeURIComponent(formData.name)}; path=/;`;
    document.cookie = `jobApplicantEmail=${encodeURIComponent(formData.email)}; path=/;`;
    document.cookie = `jobApplicantPosition=${encodeURIComponent(formData.position)}; path=/;`;

    // Also, set session storage for these fields
    sessionStorage.setItem("jobApplicantName", formData.name);
    sessionStorage.setItem("jobApplicantEmail", formData.email);
    sessionStorage.setItem("jobApplicantPosition", formData.position);

    if (onSubmit) {
      onSubmit(formData);
    }

    // Prepare FormData to send to backend
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "cv" && value) {
        data.append(key, value);
      } else {
        data.append(key, value);
      }
    });

    // Ensure position is set from URL param
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Job Application</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="cnic">CNIC</Label>
              <Input id="cnic" name="cnic" value={formData.cnic} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="currentAddress">Current Address</Label>
              <Textarea id="currentAddress" name="currentAddress" value={formData.currentAddress} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="education">Education</Label>
              <Textarea id="education" name="education" value={formData.education} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="lastSalary">Last Salary</Label>
              <Input id="lastSalary" name="lastSalary" type="number" value={formData.lastSalary} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="expectedSalary">Expected Salary</Label>
              <Input id="expectedSalary" name="expectedSalary" type="number" value={formData.expectedSalary} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="joinDate">When can you join?</Label>
              <Input id="joinDate" name="joinDate" type="date" value={formData.joinDate} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="position">Position applying for</Label>
              <Input id="position" name="position" value={formData.position || ""} readOnly />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="experience">Work Experience</Label>
              <Textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="whyHireYou">Why should we hire you?</Label>
              <Textarea id="whyHireYou" name="whyHireYou" value={formData.whyHireYou} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="references">References</Label>
              <Textarea id="references" name="references" value={formData.references} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="cv">Upload CV (PDF)</Label>
              <Input id="cv" name="cv" type="file" accept=".pdf" onChange={handleFileChange} required />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Submit Application
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
