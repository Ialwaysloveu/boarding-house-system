'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useAuth } from '../../lib/auth';

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) { setError(parsed.error.errors[0].message); return; }
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center' }}>
      <h2>Welcome Back</h2>
      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input id="email" type="email" className="input-field" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
            <input id="password" type="password" className="input-field" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Loading...' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
}