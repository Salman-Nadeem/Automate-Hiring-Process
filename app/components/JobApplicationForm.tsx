"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

const positions = ["Software Engineer", "Data Scientist", "Product Manager", "UX Designer", "Marketing Specialist"]

const skillsByPosition = {
  "Software Engineer": ["JavaScript", "React", "Node.js", "Python", "Java", "C++"],
  "Data Scientist": ["Python", "R", "SQL", "Machine Learning", "Statistics", "Data Visualization"],
  "Product Manager": ["Agile Methodologies", "User Research", "Roadmapping", "Analytics", "Stakeholder Management"],
  "UX Designer": ["User Research", "Wireframing", "Prototyping", "Figma", "Adobe XD", "User Testing"],
  "Marketing Specialist": [
    "Digital Marketing",
    "SEO",
    "Content Creation",
    "Social Media Management",
    "Analytics",
    "Email Marketing",
  ],
}

export default function JobApplicationForm({ onSubmit }) {
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
    skills: [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, cv: e.target.files[0] }))
  }

  const handleSkillChange = (skill) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: prevData.skills.includes(skill)
        ? prevData.skills.filter((s) => s !== skill)
        : [...prevData.skills, skill],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

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
              <Textarea
                id="currentAddress"
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleChange}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="education">Education</Label>
              <Textarea id="education" name="education" value={formData.education} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="lastSalary">Last Salary</Label>
              <Input
                id="lastSalary"
                name="lastSalary"
                type="number"
                value={formData.lastSalary}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="expectedSalary">Expected Salary</Label>
              <Input
                id="expectedSalary"
                name="expectedSalary"
                type="number"
                value={formData.expectedSalary}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="joinDate">When can you join?</Label>
              <Input
                id="joinDate"
                name="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="position">Position applying for</Label>
              <Select
                name="position"
                value={formData.position}
                onValueChange={(value) => handleChange({ target: { name: "position", value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.position && (
              <div className="md:col-span-2">
                <Label>Skills</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {skillsByPosition[formData.position].map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={formData.skills.includes(skill)}
                        onCheckedChange={() => handleSkillChange(skill)}
                      />
                      <label
                        htmlFor={skill}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="md:col-span-2">
              <Label htmlFor="experience">Work Experience</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="whyHireYou">Why should we hire you?</Label>
              <Textarea
                id="whyHireYou"
                name="whyHireYou"
                value={formData.whyHireYou}
                onChange={handleChange}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="references">References</Label>
              <Textarea
                id="references"
                name="references"
                value={formData.references}
                onChange={handleChange}
                required
              />
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
  )
}

