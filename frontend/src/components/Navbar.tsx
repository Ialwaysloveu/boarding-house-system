'use client';
import Link from 'next/link';
import { useAuth } from '../lib/auth';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" aria-label="Home" style={{ color: 'var(--primary-color)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-3v9h-4v-6H10v6H6v-9H3l9-8z"/></svg>
        </Link>
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