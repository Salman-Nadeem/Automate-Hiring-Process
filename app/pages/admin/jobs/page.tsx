'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Sidebar from '@/app/components/Sidebaradmin';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function JobPostingForm() {
  const [formData, setFormData] = useState({
    title: 'Software Engineer',
    company: '',
    location: '',
    salary: '',
    type: '',
    description: '',
    requirements: '',
    responsibilities: '',
    experienceLevel: '',
    education: "",
    applicationDeadline: '',
    contactEmail: '',
    benefits: '',
    remoteWork: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('✅ Job posted successfully!');
        setFormData({
          title: 'Software Engineer',
          company: '',
          location: '',
          salary: '',
          type: 'Full-time',
          description: '',
          requirements: '',
          responsibilities: '',
          experienceLevel: 'Mid-Level',
          education: "Bachelor's Degree",
          applicationDeadline: '',
          contactEmail: '',
          benefits: '',
          remoteWork: false,
        });
      } else {
        setMessage('❌ Failed to post job.');
      }
    } catch (error) {
      setMessage('❌ Error submitting form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Card className="max-w-3xl mx-auto mt-10 p-8 shadow-xl rounded-xl border">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-6">
              Post  Job By Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Basic Information */}
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-xl font-semibold mb-4">Job Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Job Title</Label>
                    <select
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg bg-background"
                      required
                    >
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="Project Manager">Project Manager</option>
                    </select>
                  </div>

                  <div>
                    <Label>Job Type</Label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg bg-background"
                      required
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>

                  <div>
                    <Label>Company Name</Label>
                    <Input 
                      name="company" 
                      value={formData.company} 
                      onChange={handleChange} 
                      placeholder="Google, Microsoft, etc." 
                      required 
                    />
                  </div>

                  <div>
                    <Label>Location</Label>
                    <Input 
                      name="location" 
                      value={formData.location} 
                      onChange={handleChange} 
                      placeholder="e.g., New York, Remote" 
                      required 
                    />
                  </div>

                  <div>
                    <Label>Salary ($/year)</Label>
                    <Input 
                      name="salary" 
                      type="number" 
                      value={formData.salary} 
                      onChange={handleChange} 
                      placeholder="Annual salary in USD" 
                      required 
                    />
                  </div>

                  <div>
                    <Label>Application Deadline</Label>
                    <Input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label>Experience Level</Label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg bg-background"
                      required
                    >
                      <option value="Entry-Level">Entry-Level</option>
                      <option value="Mid-Level">Mid-Level</option>
                      <option value="Senior-Level">Senior-Level</option>
                      <option value="Director">Director</option>
                      <option value="Executive">Executive</option>
                    </select>
                  </div>

                  <div>
                    <Label>Education Requirement</Label>
                    <select
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg bg-background"
                      required
                    >
                      <option value="High School">High School</option>
                      <option value="Associate Degree">Associate Degree</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="PhD">PhD</option>
                      <option value="No Formal Education Required">No Formal Education Required</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Job Description Section */}
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                
                <div>
                  <Label>Detailed Description</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the role and responsibilities..."
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <Label>Key Requirements</Label>
                  <Textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="List requirements (comma separated)"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label>Key Responsibilities</Label>
                  <Textarea
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    placeholder="List key responsibilities..."
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="hr@company.com"
                      required
                    />
                  </div>

                
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Additional Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Benefits & Perks</Label>
                    <Textarea
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleChange}
                      placeholder="List benefits (health insurance, PTO, etc.)"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-4 pt-6">
                    <Switch
                      id="remoteWork"
                      name="remoteWork"
                      checked={formData.remoteWork}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, remoteWork: checked }))
                      }
                    />
                    <Label htmlFor="remoteWork">Remote Work Available</Label>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold mt-8"
                disabled={loading}
              >
                {loading ? 'Posting Job...' : 'Publish Job Listing'}
              </Button>
              
              {message && (
                <p className={`text-center mt-4 text-lg ${
                  message.includes('✅') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {message}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}