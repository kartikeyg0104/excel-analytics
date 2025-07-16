import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import { useMobile } from '../hooks/use-mobile';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobile();

  // Close sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Close sidebar when clicking outside on mobile
  const handleBackdropClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Mobile Backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleBackdropClick}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 overflow-auto transition-all duration-300 ${
        isMobile ? 'w-full' : ''
      }`}>
        <div className={`p-4 ${isMobile ? 'pt-20' : 'p-6'}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
