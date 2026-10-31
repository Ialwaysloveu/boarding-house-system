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
  const [tenantId, setTenantId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    const [b, l, t] = await Promise.all([api.get('/bookings'), api.get('/listings'), api.get('/tenants')]);
    setTenants(t.data);
    setBookings(b.data); setListings(l.data);
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

