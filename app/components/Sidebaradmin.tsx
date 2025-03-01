'use client';

import { useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SidebarAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Sidebar close hone ka function
  const closeSidebar = () => setIsOpen(false);

  // Logout function
  const handleLogout = () => {
    // Clear session storage
    
    
    // Redirect to login page
    router.push('/');
  };

  return (
    <div>
      {/* Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-3">
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 p-6 transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-xl font-bold dark:text-white">TalentFlow</h1>
          <button onClick={closeSidebar} className="p-2 text-gray-700 dark:text-gray-300">
            ✖
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="space-y-2">
          <ul>
            <li>
              <Link href="/pages/admin/dashboard/" onClick={closeSidebar} className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 transition hover:bg-blue-50 dark:hover:bg-gray-800">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/pages/admin/jobs/" onClick={closeSidebar} className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 transition hover:bg-blue-50 dark:hover:bg-gray-800">
                Jobs
              </Link>
            </li>
            <li>
              <Link href="/pages/admin/Showjob/" onClick={closeSidebar} className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 transition hover:bg-blue-50 dark:hover:bg-gray-800">
                Show all Job
              </Link>
            </li>
            <li>
              <Link href="/pages/admin/candidate" onClick={closeSidebar} className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 transition hover:bg-blue-50 dark:hover:bg-gray-800">
                Candidate
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 text-white bg-red-600 rounded-lg transition hover:bg-red-700"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </aside>
    </div>
  );
}
