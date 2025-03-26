"use client";

import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SidebarAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session storage
    router.push("/"); // Redirect to login page
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 shadow-lg"
        aria-label="Toggle Sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-indigo-800 via-indigo-700 to-purple-800 dark:from-gray-900 dark:via-gray-850 dark:to-purple-900 p-6 transition-transform transform shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-72"
        } z-40`}
      >
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-white tracking-wide">
            <span className="bg-gradient-to-r from-teal-300 to-purple-300 text-transparent bg-clip-text">
              TalentFlow
            </span>
          </h1>
          <button
            onClick={closeSidebar}
            className="p-2 text-indigo-200 hover:text-white transition-colors duration-200"
            aria-label="Close Sidebar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-3">
          <ul>
            {[
              { href: "/pages/admin/dashboard/", label: "Dashboard" },
              { href: "/pages/admin/jobs/", label: "Jobs" },
              { href: "/pages/admin/Showjob/", label: "Show All Jobs" },
              { href: "/pages/admin/candidate", label: "Candidates" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={closeSidebar}
                  className="block px-4 py-3 rounded-xl text-indigo-100 font-medium transition-all duration-300 hover:bg-indigo-600 hover:text-white hover:shadow-md hover:-translate-y-0.5 flex items-center gap-3 group"
                >
                  <span className="w-2 h-2 bg-teal-400 rounded-full group-hover:bg-white transition-colors"></span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-10 w-full flex items-center justify-center gap-3 px-4 py-3 text-white bg-gradient-to-r from-red-500 to-red-700 rounded-xl transition-all duration-300 hover:from-red-600 hover:to-red-800 hover:shadow-lg hover:scale-105"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-semibold">Logout</span>
        </button>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-purple-900/50 to-transparent pointer-events-none"></div>
      </aside>

      {/* Overlay for closing sidebar on outside click */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={closeSidebar}
        ></div>
      )}
    </div>
  );
}