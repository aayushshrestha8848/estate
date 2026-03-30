import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import PropertyCard from '../components/PropertyCard';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useFav } from '../context/FavContext';

const Favourites = () => {
  const { favourites, toggleFavorite, loadingFavs } = useFav();
  const [favouriteProperties, setFavouriteProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await api.get('/api/properties?page=1&limit=100');
        const allProps = Array.isArray(res.data?.data) ? res.data.data : res.data || [];
        const favProps = allProps.filter(p => favourites.includes(p._id));
        setFavouriteProperties(favProps);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Failed to fetch data.');
        }
      } finally {
        setLoadingProps(false);
      }
    };
    if (!loadingFavs) {
      fetchProps();
    }
  }, [loadingFavs, favourites, navigate]);

  const isLoading = loadingProps || loadingFavs;

  if (isLoading) return <DashboardLayout><div className="screen-center"><div className="spinner"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="tab-view fade-in">
        <div className="view-header">
          <h2>My Favourites</h2>
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
                key={property._id}
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

