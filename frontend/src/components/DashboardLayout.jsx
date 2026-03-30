import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const [user] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }

    // Clean up theme artifacts
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('theme');
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <Navbar user={user} handleLogout={handleLogout} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
// `nexport default DashboardLayout;
