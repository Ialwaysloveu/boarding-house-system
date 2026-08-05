import React from 'react';

export default function RegisterPage() {
  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create an Account</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Join the best boarding house platform</p>
      
      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontWeight: 500 }}>First Name</label>
              <input type="text" placeholder="John" className="input-field" required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontWeight: 500 }}>Last Name</label>
              <input type="text" placeholder="Doe" className="input-field" required />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input type="email" placeholder="john@example.com" className="input-field" required />
          </div>
          <div>
            <label style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
            <input type="password" placeholder="••••••••" className="input-field" required />
          </div>
          
          <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Sign Up
          </button>
        </form>
        
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Already have an account? <a href="/login" style={{ fontWeight: 600 }}>Sign in</a>
        </p>
      </div>
    </div>
  );
}
