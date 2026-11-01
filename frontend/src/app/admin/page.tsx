'use client';
import { useEffect, useState } from 'react';
import { RequireAdmin } from '../../components/Guard';
import api from '../../lib/api';
import { useAuth } from '../../lib/auth';

export default function AdminPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lName, setLName] = useState('');
  const [lDesc, setLDesc] = useState('');
  const [lAddr, setLAddr] = useState('');
  const [lCity, setLCity] = useState('');
  const [lAmen, setLAmen] = useState('');
  const [lImgs, setLImgs] = useState('');

  async function load() {
    const [b, l, t] = await Promise.all([api.get('/bookings'), api.get('/listings'), api.get('/tenants')]);
    setBookings(b.data); setListings(l.data); setTenants(t.data);
  }

  useEffect(() => { load().finally(()=>setLoading(false)); }, []);

  async function updateStatus(id: string, status: string) {
    try { await api.put('/bookings/' + id + '/status', { status }); await load(); }
    catch (e: any) { alert(e.response?.data?.message || 'Failed'); }
  }

  return (
    <RequireAdmin>
      <div>
        <h1>Admin Dashboard</h1>
        {loading ? <p>Loading...</p> : (
          <>
            <h2>Create Listing</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
              <input className="input-field" placeholder="Name" value={lName} onChange={e=>setLName(e.target.value)} />
              <input className="input-field" placeholder="Description" value={lDesc} onChange={e=>setLDesc(e.target.value)} />
              <input className="input-field" placeholder="Address" value={lAddr} onChange={e=>setLAddr(e.target.value)} />
              <input className="input-field" placeholder="City" value={lCity} onChange={e=>setLCity(e.target.value)} />
              <input className="input-field" placeholder="Amenities (comma)" value={lAmen} onChange={e=>setLAmen(e.target.value)} />
              <input className="input-field" placeholder="Image URLs (comma)" value={lImgs} onChange={e=>setLImgs(e.target.value)} />
              <button className="btn btn-primary" onClick={async()=>{ try { await api.post('/listings',{name:lName,description:lDesc,address:lAddr,city:lCity,amenities:lAmen.split(',').map(s=>s.trim()).filter(Boolean),images:lImgs.split(',').map(s=>s.trim()).filter(Boolean)}); alert('Created'); load(); } catch(e:any){ alert(e.response?.data?.message||'Failed'); } }}>Create Listing</button>
            </div>
            <h2>Bookings</h2>
            <ul>
              {bookings.map(b => (
                <li key={b.id}>
                  {b.user?.firstName} {b.user?.lastName} - {b.room?.name} - {b.status}
                  {b.status === 'PENDING' && (
                    <>
                      <button onClick={() => updateStatus(b.id, 'APPROVED')}>Approve</button>
                      <button onClick={() => updateStatus(b.id, 'REJECTED')}>Reject</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <p style={{ color: 'var(--text-secondary)' }}>Listings owned by you: {listings.filter(l=>l.ownerId===user?.id).length}</p>
          </>
        )}
      </div>
    </RequireAdmin>
  );
}