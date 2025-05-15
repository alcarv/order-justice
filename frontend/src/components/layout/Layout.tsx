import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-64 bg-slate-800 flex-shrink-0">
          <Sidebar />
        </div>
        
        {/* Mobile sidebar - drawer */}
        {isMobile && (
          <div className={`fixed inset-0 z-40 ${sidebarOpen ? 'block' : 'hidden'}`}>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
              onClick={() => setSidebarOpen(false)}
            ></div>
            
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-slate-800 flex-shrink-0 transition-transform transform duration-300 ease-in-out">
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="text-white hover:text-gray-300"
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-slate-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile bottom navigation */}
      {isMobile && <MobileNav />}
    </div>
  );
};

export default Layout;