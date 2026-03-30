import React from 'react';

const PropertyCard = ({ property, isFavorite, onToggleFavorite }) => {
  const isLand = property.type?.toLowerCase() === 'land';

  return (
    <div className="property-card">
      {property.isFeatured && <div className="featured-badge"> Featured</div>}
      
      <div className="image-container">
        <img 
          src={property.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={property.title} 
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        <div className="property-overlay">
          <p className="overlay-desc">{property.description || 'No additional description provided for this property.'}</p>
          <div className="overlay-owner">
            <span className="owner-label">Listed by: </span>
            <span className="owner-name">{property.ownedBy || 'Agency'}</span>
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 title={property.title}>{property.title}</h3>
          {property.status && (
            <span className={`status-badge ${property.status.toLowerCase()}`}>
              {property.status}
            </span>
          )}
        </div>
        <p className="location"> {property.location}</p>
        
        <div className="property-details">
          <span className="detail-item type-badge">{property.type}</span>
          {!isLand && property.bedroom && <span className="detail-item"> {property.bedroom} Bed</span>}
          {!isLand && property.bathroom && <span className="detail-item"> {property.bathroom} Bath</span>}
          {property.area && <span className="detail-item"> {property.area} sq ft</span>}
        </div>
        
        <div className="card-footer">
          <p className="price">Rs. {property.price.toLocaleString()}</p>
        </div>
      </div>
      
      <button 
        className={`favorite-button ${isFavorite ? 'active' : ''}`} 
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(property._id, isFavorite);
        }}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  );
};

export default PropertyCard;
