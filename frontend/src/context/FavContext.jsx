import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const FavContext = createContext();

export const FavProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

  const fetchFavourites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await api.get('/api/favourites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      let favData = res.data?.data || res.data?.favourites || res.data || [];
      if (!Array.isArray(favData)) favData = [];
      
      const favIds = favData.map(f => f.propertyId?._id || f.propertyId || f.property?._id || f._id);
      setFavourites(favIds);
    } catch (err) {
      console.error('Failed to fetch favourites:', err);
    } finally {
      setLoadingFavs(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const toggleFavorite = async (propertyId, isFavorite) => {
    try {
      if (isFavorite) {
        setFavourites(prev => prev.filter(id => id !== propertyId));
        await api.delete(`/api/favourites/${propertyId}`);
      } else {
        setFavourites(prev => [...prev, propertyId]);
        await api.post(`/api/favourites/${propertyId}`);
      }
    } catch (err) {
      console.error('Failed to update favourite:', err);
      // Revert optimism on error
      fetchFavourites();
    }
  };

  return (
    <FavContext.Provider value={{ favourites, toggleFavorite, fetchFavourites, loadingFavs }}>
      {children}
    </FavContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFav = () => useContext(FavContext);
