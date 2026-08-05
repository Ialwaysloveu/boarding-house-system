import React from 'react';

export default function LoginPage() {
  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Sign in to your account</p>
      
      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input type="email" placeholder="john@example.com" className="input-field" required />
          </div>
          <div>
            <label style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
            <input type="password" placeholder="••••••••" className="input-field" required />
          </div>
          
          <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Sign In
          </button>
        </form>
        
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Don't have an account? <a href="/register" style={{ fontWeight: 600 }}>Sign up</a>
        </p>
      </div>
    </div>
  );
}
