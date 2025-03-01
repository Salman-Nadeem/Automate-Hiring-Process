"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"login" | "forgot" | "otp" | "reset">("login");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (callback: Function) => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await callback();
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        {message && <p className="text-green-500 text-center mb-3">{message}</p>}
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        {step === "login" && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Sign In</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <button onClick={() => handleAction(async () => {
              const response = await axios.post("/api/Auth/login/", { email, password });
              if (response.status === 200) {
                sessionStorage.setItem("token", response.data.token);
                router.push("/pages/admin/dashboard");
              }
            })} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition duration-300">
              Login
            </button>
            <button onClick={() => setStep("forgot")} className="text-sm text-indigo-600 mt-4 block text-center hover:underline">
              Forgot Password?
            </button>    
            
      

                  </>
        )}

        {step === "forgot" && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Forgot Password</h2>
            <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <button onClick={() => handleAction(async () => {
              await axios.post("/api/Auth/forgot-password/", { email: forgotEmail });
              setStep("otp");
              setMessage("OTP sent to your email.");
            })} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition duration-300">
              Send OTP
            </button>

            
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <a href="/pages/login/" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Back
                </a>
              </p>
            </div>


          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Verify OTP</h2>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <button onClick={() => handleAction(async () => {
              await axios.post("/api/Auth/verifyotp/", { email: forgotEmail, otp });
              setStep("reset");
              setMessage("OTP verified, reset your password.");
            })} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition duration-300">
              Verify OTP
            </button>


            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <a href="/pages/login/" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Back
                </a>
              </p>
            </div>


          </>
        )}

        {step === "reset" && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Reset Password</h2>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <button onClick={() => handleAction(async () => {
              await axios.post("/api/Auth/resetpassword/", { email: forgotEmail, newPassword });
              setStep("login");
              setMessage("Password reset successful. You can log in now.");
            })} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition duration-300">
              Update Password
            </button>


            
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <a href="/pages/login/" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Back
                </a>
              </p>
            </div>


          </>
        )}
      </div>
    </div>
  );
}
