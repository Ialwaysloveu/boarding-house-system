'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');

  async function load() {
    setLoading(true); setError('');
    try {
      const res = await api.get('/listings', { params: { q: q || undefined, city: city || undefined } });
      setListings(res.data);
    } catch (e: any) { setError(e.response?.data?.message || 'Failed to load'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function lowestPrice(l: any) {
    const prices = (l.rooms || []).map((r: any) => Number(r.pricePerMonth));
    return prices.length ? Math.min(...prices) : null;
  }
  function availRooms(l: any) { return (l.rooms || []).filter((r: any) => r.isAvailable).length; }

  return (
    <div>
      <div className="card" style={{ display: 'flex', gap: '1rem', padding: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input className="input-field" placeholder="Search by name or city..." value={q} onChange={e=>setQ(e.target.value)} style={{ flex: 2, minWidth: '200px' }} />
        <input className="input-field" placeholder="City" value={city} onChange={e=>setCity(e.target.value)} style={{ flex: 1, minWidth: '150px' }} />
        <button className="btn btn-primary" onClick={load}>Search</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
      {!loading && !error && listings.length === 0 && <p>No listings found.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {listings.map((l: any) => (
          <div key={l.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--border-color)' }}>
              {l.images?.[0] ? <img src={l.images[0]} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%' }} />}
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3>{l.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{l.city}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{availRooms(l)} rooms available</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{lowestPrice(l) !== null ? '₱' + lowestPrice(l)!.toLocaleString() + '/mo' : ''}</span>
                <Link href={'/listings/' + l.id} className="btn" style={{ border: '1px solid var(--border-color)', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}