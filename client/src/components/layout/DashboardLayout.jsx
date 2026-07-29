import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import { useSearch } from '../../context/SearchContext';
import '../../styles/App.css';

export default function DashboardLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { setSearchQuery } = useSearch();

  useEffect(() => {
    setSearchQuery('');
  }, [location.pathname, setSearchQuery]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 95,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      <div className="main-content">
        <Navbar toggleSidebar={toggleSidebar} title={title} />
        
        <main className="content-body animate-fade-in">
          <Breadcrumb />
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
