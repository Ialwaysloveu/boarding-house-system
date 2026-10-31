'use client';
import { useEffect, useState } from 'react';
import { RequireAuth } from '../../components/Guard';
import api from '../../lib/api';

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [b, p, t] = await Promise.all([api.get('/bookings'), api.get('/payments'), api.get('/tenants')]);
      setTenants(t.data);
        setBookings(b.data); setPayments(p.data);
      } finally { setLoading(false); }
    })();
  }, []);

  return (
    <RequireAuth>
      <div>
        <h1>My Dashboard</h1>
        {loading ? <p>Loading...</p> : (
          <>
            <p>Total bookings: {bookings.length} · Pending: {bookings.filter(b=>b.status==='PENDING').length} · Approved: {bookings.filter(b=>b.status==='APPROVED').length}</p>
            <p>Total paid: ₱{payments.reduce((s,p)=>s+Number(p.amount),0).toLocaleString()}</p>
            <h2>My Bookings</h2>
            <ul>{bookings.map(b=><li key={b.id}>{b.room?.name || b.roomId} - {b.status}</li>)}</ul>
            <h2>Payments</h2>
            <ul>{payments.map(p=><li key={p.id}>₱{Number(p.amount).toLocaleString()} - {p.status}</li>)}</ul>
          </>
        )}
      </div>
    </RequireAuth>
  );
}
