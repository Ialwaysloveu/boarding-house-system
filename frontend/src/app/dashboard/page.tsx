import React from 'react';

export default function DashboardPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>My Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your bookings and tenancy</p>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Active Booking', value: '1', icon: '📋' },
          { label: 'Current Room', value: 'Room 3A', icon: '🛏️' },
          { label: 'Next Payment', value: '₱5,000', icon: '💳' },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{stat.label}</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Booking History */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>My Bookings</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Boarding House</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Room</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { bh: 'Casa Verde BH', room: 'Room 3A', date: 'Aug 1, 2026', status: 'Approved', color: '#10b981' },
                { bh: 'Sunrise Dormitory', room: 'Room 2B', date: 'Jul 20, 2026', status: 'Rejected', color: '#ef4444' },
              ].map((b, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500 }}>{b.bh}</td>
                  <td style={{ padding: '0.75rem' }}>{b.room}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{b.date}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600, color: b.color, background: `${b.color}15` }}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Payment History</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Reference</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'Aug 1, 2026', amount: '₱5,000', ref: 'PAY-20260801', status: 'Completed' },
                { date: 'Jul 1, 2026', amount: '₱5,000', ref: 'PAY-20260701', status: 'Completed' },
              ].map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem' }}>{p.date}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{p.amount}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{p.ref}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600, color: '#10b981', background: '#10b98115' }}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
