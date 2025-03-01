"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import SidebarAdmin from "@/app/components/Sidebaradmin";


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
    <>   
    <SidebarAdmin/>
    
     <div className="overflow-x-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Job Applications</h1>
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">CNIC</th>
            <th className="p-3 text-left">Address</th>
            <th className="p-3 text-left">Education</th>
            <th className="p-3 text-left">Last Salary</th>
            <th className="p-3 text-left">Expected Salary</th>
            <th className="p-3 text-left">Join Date</th>
            <th className="p-3 text-left">Position</th>
            <th className="p-3 text-left">Experience</th>
            <th className="p-3 text-left">References</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{app.name}</td>
              <td className="p-3">{app.email}</td>
              <td className="p-3">{app.phone}</td>
              <td className="p-3">{app.cnic}</td>
              <td className="p-3">{app.currentAddress}</td>
              <td className="p-3">{app.education}</td>
              <td className="p-3">{app.lastSalary}</td>
              <td className="p-3">{app.expectedSalary}</td>
              <td className="p-3">{app.joinDate}</td>
              <td className="p-3">{app.position}</td>
              <td className="p-3">{app.experience}</td>
              <td className="p-3">{app.references}</td>
              <td className="p-3 text-center">
                <Button
                  onClick={() => handleDelete(app._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>

  );
}
