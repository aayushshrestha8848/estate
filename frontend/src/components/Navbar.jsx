import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.avif';
import { useFav } from '../context/FavContext';

const Navbar = ({ user, handleLogout }) => {
  const { favourites } = useFav();
  
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <img src={logo} alt="EstatePortal Logo" className="brand-logo-img" />   
        <span className="brand-text">EstatePortal</span>
      </div>

      <div className="nav-tabs">
        <NavLink to="/properties" className={({isActive}) => `tab-btn ${isActive ? 'active' : ''}`}>Properties</NavLink>
        <NavLink to="/favourites" className={({isActive}) => `tab-btn fav-toggle-btn ${isActive ? 'active' : ''}`}>
          Favourites (
          {favourites?.length > 0 && (
            <span className="fav-count-badge">{favourites.length}</span>
          )})
        </NavLink>
      </div>

      <div className="nav-user">
        <div className="user-profile">
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt="Profile" className="user-avatar" referrerPolicy="no-referrer" />
          ) : (
            <div className="user-avatar-placeholder">{user?.name?.charAt(0) || 'U'}</div>
          )}
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="role-badge">{user?.role || 'Buyer'}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn" title="Logout">   
          <span className="logout-icon"></span> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
