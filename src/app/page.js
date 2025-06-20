'use client';

import DashboardView from '../components/dashboard/DashboardView';

export default function Home() {
  return (
    <>
      
        {/* Desktop Navbar */}
        <nav className="bg-white shadow p-4 justify-between items-center hidden md:flex sticky top-0 z-50">
          <div className="flex items-center space-x-4">
            <img src="/images/logo.png" alt="Logo" className="h-10" />
            <img src="/images/textlogo.png" alt="Text Logo" className="h-10" />
          </div>
          <div className="flex items-center cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center mr-2">
              <span className="text-white text-lg font-semibold">S</span>
            </div>
            {/* <span className="text-gray-700">Afsal Ch</span> */}
          </div>
        </nav>

        {/* Mobile Navbar */}
        <nav className="bg-white shadow p-4 flex justify-center items-center sticky top-0 z-50 md:hidden">
          <img src="/images/textlogo.png" alt="Text Logo" className="h-10" />
        </nav>

      <DashboardView />
    </>
  );
}
