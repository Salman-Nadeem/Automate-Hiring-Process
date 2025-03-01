'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Sidebar from '@/app/components/Sidebaradmin';

export default function JobPostingForm() {
  const [formData, setFormData] = useState({
    title: 'Software Engineer',
    company: '',
    location: '',
    salary: '',
    type: 'Full-time',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        setFormData({ title: 'Software Engineer', company: '', location: '', salary: '', type: 'Full-time' });
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
        <Card className="max-w-2xl mx-auto mt-10 p-6 shadow-lg rounded-lg border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Post a Job</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Job Title Dropdown */}
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Project Manager">Project Manager</option>
              </select>
              
              <Input name="company" value={formData.company} onChange={handleChange} placeholder="Company Name" required />
              <Input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
              <Input name="salary" type="number" value={formData.salary} onChange={handleChange} placeholder="Salary (e.g. 50000)" required />
              
              {/* Job Type Dropdown */}
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Freelance">Freelance</option>
              </select>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Posting...' : 'Post Job'}
              </Button>
              {message && <p className="text-center text-red-500 mt-4">{message}</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
