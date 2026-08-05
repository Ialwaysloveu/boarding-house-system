import React from 'react';

export default function AdminDashboard() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Overview of your boarding house system</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Total Listings', value: '12', icon: '🏠', color: '#6366f1' },
          { label: 'Active Tenants', value: '48', icon: '👥', color: '#10b981' },
          { label: 'Pending Bookings', value: '5', icon: '📋', color: '#f59e0b' },
          { label: 'Revenue (Monthly)', value: '₱240,000', icon: '💰', color: '#ec4899' },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{stat.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent Bookings</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { name: 'Maria Santos', room: 'Room 3A', status: 'Pending', color: '#f59e0b' },
              { name: 'Juan Dela Cruz', room: 'Room 1B', status: 'Approved', color: '#10b981' },
              { name: 'Ana Reyes', room: 'Room 2C', status: 'Rejected', color: '#ef4444' },
            ].map((booking, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '8px', background: 'var(--background-color)' }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{booking.name}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{booking.room}</p>
                </div>
                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600, color: booking.color, background: `${booking.color}15` }}>{booking.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent Payments</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { name: 'Carlos Garcia', amount: '₱5,000', date: 'Aug 5, 2026' },
              { name: 'Maria Santos', amount: '₱4,500', date: 'Aug 4, 2026' },
              { name: 'Juan Dela Cruz', amount: '₱6,000', date: 'Aug 3, 2026' },
            ].map((payment, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '8px', background: 'var(--background-color)' }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{payment.name}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{payment.date}</p>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>{payment.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
