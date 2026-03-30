import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
    
    // Clean up theme artifacts
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('theme');
  }, [navigate]);

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