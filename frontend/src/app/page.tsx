import React from 'react';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Find Your Perfect Boarding House
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
        Discover affordable, safe, and comfortable boarding houses across the Philippines. Search by city, university, or price.
      </p>
      
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '1rem', padding: '1rem' }}>
        <input 
          type="text" 
          placeholder="Search by city (e.g., Manila, Cebu, Davao)..." 
          className="input-field"
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" style={{ padding: '0 2rem' }}>Search</button>
      </div>

      <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Placeholder for listings */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius) var(--radius) 0 0', marginBottom: '1rem' }}></div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Sample Boarding House {i}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Quezon City, Metro Manila</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>₱5,000 / month</span>
              <a href={`/listings/${i}`} className="btn" style={{ border: '1px solid var(--border-color)' }}>View Details</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
