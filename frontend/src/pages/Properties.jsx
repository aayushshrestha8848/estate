import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import PropertyCard from '../components/PropertyCard';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useFav } from '../context/FavContext';

const Properties = () => {
  const { favourites, toggleFavorite, loadingFavs } = useFav();
  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/api/properties?page=1');
        const newProps = res.data?.data || res.data?.properties || res.data || [];
        setProperties(Array.isArray(newProps) ? newProps : []);
        if (Array.isArray(newProps) && newProps.length < 9) setHasMore(false);
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
    fetchProperties();
  }, [navigate]);

  const loadMoreProperties = async () => {
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const res = await api.get(`/api/properties?page=${nextPage}`);
      const newProps = res.data?.data || res.data?.properties || res.data || [];
      const propsArray = Array.isArray(newProps) ? newProps : [];

      setProperties([...properties, ...propsArray]);
      setPage(nextPage);
      if (propsArray.length < 9) setHasMore(false);
    } catch (err) {
      console.error('Failed to load more properties:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const uniqueLocations = [...new Set(properties.map(p => p.location).filter(Boolean))];

  const filteredProperties = properties.filter(p => {
    const titleMatch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const locMatch = (p.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || locMatch;
    const matchesType = filterType ? (p.type || '').toLowerCase() === filterType.toLowerCase() : true;
    const matchesLocation = filterLocation ? (p.location || '').toLowerCase() === filterLocation.toLowerCase() : true;
    return matchesSearch && matchesType && matchesLocation;
  });

  const isLoading = loadingProps || loadingFavs;

  if (isLoading) return <DashboardLayout><div className="screen-center"><div className="spinner"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="tab-view fade-in">
        <div className="view-header">
          <h2>Available Properties</h2>
          <p>Find your next perfect property from our extensive catalog.</p>    
        </div>
        {error && <div className="alert-error">{error}</div>}
        <div className="filters-container">
          <div className="search-bar">
            <span className="icon"></span>
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-options">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Land">Land</option>
            </select>
            <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
              <option value="">All Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="empty-state">
            <h3>No properties found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="properties-grid">
              {filteredProperties.map(property => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isFavorite={favourites.includes(property._id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
            {hasMore && !searchQuery && !filterType && !filterLocation && (     
              <div className="load-more-container">
                <button onClick={loadMoreProperties} disabled={loadingMore} className="btn-primary">        
                  {loadingMore ? 'Loading ...' : 'Load More Options'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Properties;
