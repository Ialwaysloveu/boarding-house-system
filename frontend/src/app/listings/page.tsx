import React from 'react';

export default function ListingsPage() {
  const sampleListings = [
    { id: '1', name: 'Casa Verde Boarding House', city: 'Quezon City', price: '₱5,000', rooms: 8 },
    { id: '2', name: 'Sunrise Dormitory', city: 'Cebu City', price: '₱4,500', rooms: 12 },
    { id: '3', name: 'Metro Student Hostel', city: 'Manila', price: '₱3,500', rooms: 6 },
    { id: '4', name: 'Greenfield Residences', city: 'Davao City', price: '₱6,000', rooms: 10 },
    { id: '5', name: 'University Heights BH', city: 'Los Baños, Laguna', price: '₱3,000', rooms: 15 },
    { id: '6', name: 'Seaside Boarding House', city: 'Iloilo City', price: '₱4,000', rooms: 5 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Browse Boarding Houses</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{sampleListings.length} boarding houses found across the Philippines</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card" style={{ display: 'flex', gap: '1rem', padding: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input type="text" placeholder="Search by name or city..." className="input-field" style={{ flex: 2, minWidth: '200px' }} />
        <select className="input-field" style={{ flex: 1, minWidth: '150px' }}>
          <option value="">All Cities</option>
          <option value="manila">Manila</option>
          <option value="cebu">Cebu City</option>
          <option value="davao">Davao City</option>
          <option value="quezon">Quezon City</option>
        </select>
        <select className="input-field" style={{ flex: 1, minWidth: '150px' }}>
          <option value="">Price Range</option>
          <option value="0-3000">Under ₱3,000</option>
          <option value="3000-5000">₱3,000 - ₱5,000</option>
          <option value="5000+">Above ₱5,000</option>
        </select>
        <button className="btn btn-primary">Search</button>
      </div>

      {/* Listing Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {sampleListings.map((listing) => (
          <div key={listing.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--border-color)', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '12px', right: '12px', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600, color: 'white', background: 'var(--success)' }}>Available</span>
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{listing.name}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>📍 {listing.city}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{listing.rooms} rooms available</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--primary-color)' }}>{listing.price}/mo</span>
                <a href={`/listings/${listing.id}`} className="btn" style={{ border: '1px solid var(--border-color)', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>View Details →</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
