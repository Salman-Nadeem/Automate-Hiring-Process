import { Button } from "@/components/ui/button"

export default function ApplicationStatus({ step, applicationData, interviewTime, testScore }) {
  const statuses = [
    "Application Submitted",
    "Shortlisted",
    "Interview Scheduled",
    "Interview Completed",
    "Test Completed",
    "Application Under Review",
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Application Status</h2>
      <ul className="space-y-2">
        {statuses.map((status, index) => (
          <li
            key={index}
            className={`flex items-center space-x-2 ${index < step - 1 ? "text-green-600" : "text-gray-600"}`}
          >
            <span className={`w-4 h-4 rounded-full ${index < step - 1 ? "bg-green-600" : "bg-gray-300"}`}></span>
            <span>{status}</span>
          </li>
        ))}
      </ul>
      {applicationData && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Your Application</h3>
          <p>
            <strong>Name:</strong> {applicationData.name}
          </p>
          <p>
            <strong>Email:</strong> {applicationData.email}
          </p>
          <p>
            <strong>Experience:</strong> {applicationData.experience} years
          </p>
          <p>
            <strong>Skills:</strong> {applicationData.skills}
          </p>
        </div>
      )}
      {interviewTime && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Your Interview</h3>
          <p>
            <strong>Scheduled for:</strong> {interviewTime}
          </p>
        </div>
      )}
      {testScore !== null && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Your Test Score</h3>
          <p>
            <strong>Score:</strong> {testScore.toFixed(2)}%
          </p>
        </div>
      )}
      {step === 6 && (
        <div className="mt-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
          <p className="font-bold">Application Under Review</p>
          <p>We are currently reviewing your application. We'll contact you soon with the results.</p>
        </div>
      )}
    </div>
  )
}

