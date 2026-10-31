'use client';
import Link from 'next/link';
import { useAuth } from '../lib/auth';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontSize: '1.5rem', color: 'var(--primary-color)', fontWeight: 700 }}>BH Finder</Link>
        <div>
          {loading ? null : user ? (
            <>
              <span style={{ marginRight: '1rem' }}>{user.firstName}</span>
              <Link href="/dashboard" style={{ marginRight: '1rem', fontWeight: 500 }}>Dashboard</Link>
              {user.role === 'ADMIN' && <Link href="/admin" style={{ marginRight: '1rem', fontWeight: 500 }}>Admin</Link>}
              <button onClick={logout} className="btn" style={{ border: '1px solid var(--border-color)' }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ marginRight: '1rem', fontWeight: 500 }}>Login</Link>
              <Link href="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}