'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useAuth } from '../../lib/auth';

const schema = z.object({ firstName: z.string().min(1), lastName: z.string().min(1), email: z.string().email(), password: z.string().min(6) });

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const parsed = schema.safeParse(form);
    if (!parsed.success) { setError(parsed.error.errors[0].message); return; }
    setLoading(true);
    try {
      await register(form);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center' }}>
      <h2>Create an Account</h2>
      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="firstName" style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontWeight: 500 }}>First Name</label>
              <input id="firstName" className="input-field" value={form.firstName} onChange={e=>setForm({...form, firstName: e.target.value})} />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="lastName" style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontWeight: 500 }}>Last Name</label>
              <input id="lastName" className="input-field" value={form.lastName} onChange={e=>setForm({...form, lastName: e.target.value})} />
            </div>
          </div>
          <div>
            <label htmlFor="email" style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input id="email" type="email" className="input-field" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label htmlFor="password" style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
            <input id="password" type="password" className="input-field" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} />
          </div>
          {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Loading...' : 'Sign Up'}</button>
        </form>
      </div>
    </div>
  );
}