'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { useAuth } from '../../../lib/auth';

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/listings/' + id);
        setListing(res.data);
      } catch (e: any) { setError(e.response?.data?.message || 'Failed'); }
      finally { setLoading(false); }
    })();
  }, [id]);

  async function book(roomId: string) {
    if (!user) { router.push('/login'); return; }
    try {
      await api.post('/bookings', { roomId, message });
      setBookingStatus('Booked! Pending approval.');
      setSelectedRoom(null);
    } catch (e: any) {
      setBookingStatus(e.response?.data?.message || 'Booking failed');
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'var(--error)' }}>{error}</p>;
  if (!listing) return null;

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
      <h1>{listing.name}</h1>
      <p style={{ color: 'var(--text-secondary)' }}>{listing.city}, {listing.address}</p>
      <p style={{ marginTop: '1rem' }}>{listing.description}</p>
      <h2 style={{ marginTop: '1.5rem' }}>Amenities</h2>
      <ul>{(listing.amenities || []).map((a: string, i: number) => <li key={i}>{a}</li>)}</ul>
      <h2 style={{ marginTop: '1.5rem' }}>Rooms</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {(listing.rooms || []).map((r: any) => (
          <div key={r.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 600 }}>{r.name}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Capacity: {r.capacity} · ₱{Number(r.pricePerMonth).toLocaleString()}/mo</p>
              <p>{r.isAvailable ? 'Available' : 'Unavailable'}</p>
            </div>
            {r.isAvailable && (
              <button className="btn btn-primary" onClick={() => setSelectedRoom(r.id)}>Book a Room</button>
            )}
          </div>
        ))}
      </div>
      {selectedRoom && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <textarea className="input-field" placeholder="Optional message" value={message} onChange={e=>setMessage(e.target.value)} />
          <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => book(selectedRoom)}>Confirm Booking</button>
        </div>
      )}
      {bookingStatus && <p style={{ marginTop: '1rem' }}>{bookingStatus}</p>}
    </div>
  );
}