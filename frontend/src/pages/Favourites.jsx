import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import PropertyCard from '../components/PropertyCard';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Favourites = () => {
  const [favouriteProperties, setFavouriteProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const token = localStorage.getItem('token');
        const [propsRes, favsRes] = await Promise.all([
          api.get('/api/properties?page=1'),
          api.get('/api/favourites', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const allProps = Array.isArray(propsRes.data?.data) ? propsRes.data.data : propsRes.data || [];
        
        let favData = favsRes.data?.data || favsRes.data?.favourites || favsRes.data || [];
        if (!Array.isArray(favData)) favData = [];
        
        const favIds = favData.map(fav => fav.propertyId?._id || fav.propertyId || fav.property?._id || fav._id);
        
        setFavouriteProperties(allProps.filter(p => favIds.includes(p._id)));
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Failed to fetch data.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, [navigate]);

  const toggleFavorite = async (propertyId, isFavorite) => {
    try {
      if (isFavorite) {
        await api.delete(`/api/favourites/${propertyId}`);
        setFavouriteProperties(favouriteProperties.filter(p => p._id !== propertyId));
      } else {
        await api.post(`/api/favourites/${propertyId}`);
        // Not typically doing a POST here in favourites view, but handled for completion
      }
    } catch (err) {
      console.error('Failed to update favourite status:', err);
    }
  };

  if (loading) return <DashboardLayout><div className="screen-center">Loading favourites...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="tab-view fade-in">
        <div className="view-header">
          <h2>My Favourites </h2>
          <p>Properties you have saved for later review.</p>
        </div>
        {error && <div className="alert-error">{error}</div>}
        
        {favouriteProperties.length === 0 ? (
          <div className="empty-state">
            <p className="no-favs">No favourites yet. Start exploring properties!</p>
          </div>
        ) : (
          <div className="properties-grid">
            {favouriteProperties.map(property => (
              <PropertyCard 
                key={`fav-${property._id}`} 
                property={property} 
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Favourites;