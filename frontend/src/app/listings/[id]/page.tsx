import React from 'react';

export default function ListingDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Sample Boarding House {params.id}</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Quezon City, Metro Manila</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>₱5,000 / month</div>
          <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: 'var(--success)', color: 'white', borderRadius: '1rem', fontSize: '0.875rem', marginTop: '0.5rem' }}>Available</span>
        </div>
      </div>

      <div style={{ width: '100%', height: '400px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius)', marginBottom: '2rem' }}></div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>About this place</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              This is a beautiful and affordable boarding house located near major universities. It offers a quiet environment for studying and resting.
            </p>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Amenities</h2>
            <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <li>Free Wi-Fi</li>
              <li>Air Conditioning</li>
              <li>Shared Kitchen</li>
              <li>Laundry Area</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Interested?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Contact the owner or send an inquiry to check availability.</p>
            <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>Book a Room</button>
            <button className="btn" style={{ width: '100%', border: '1px solid var(--border-color)' }}>Send Inquiry</button>
          </div>
        </div>
      </div>
    </div>
  );
}
