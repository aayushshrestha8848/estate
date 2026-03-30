import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import Favourites from './pages/Favourites';
import { FavProvider } from './context/FavContext';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to='/login' replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to='/properties' replace />;
  }
  return children;
};

function App() {
  return (
    <FavProvider>
      <Router>
        <div className='app'>
          <Routes>
            <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
            <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />

            <Route path='/properties' element={<ProtectedRoute><Properties /></ProtectedRoute>} />
            <Route path='/favourites' element={<ProtectedRoute><Favourites /></ProtectedRoute>} />

            <Route path='/dashboard' element={<Navigate to='/properties' replace />} />
            <Route path='/' element={<Navigate to='/properties' replace />} />
            <Route path='*' element={<Navigate to='/properties' replace />} />
          </Routes>
        </div>
      </Router>
    </FavProvider>
  );
}

export default App;
