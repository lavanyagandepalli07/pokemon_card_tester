'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: '', color: 'transparent' },
    { label: 'Weak', color: '#ef4444' },
    { label: 'Fair', color: '#f59e0b' },
    { label: 'Good', color: '#3b82f6' },
    { label: 'Strong', color: '#10b981' },
  ];

  return { score, ...levels[score] };
}

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const { error: authError } = await signIn(email, password);
    setLoading(false);

    if (authError) {
      setError(authError.includes('Invalid') ? 'Invalid email or password.' : authError);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card card card-glow fade-in">
        <div className="auth-header">
          <div className="auth-logo">⚡</div>
          <h1 className="auth-title" style={{ fontSize: '1.75rem' }}>Welcome back</h1>
          <p className="auth-subtitle">Sign in to your PokéAuth account</p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: '1rem' }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email address</label>
            <input
              id="login-email"
              type="email"
              className={`form-input${error ? ' error' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              className={`form-input${error ? ' error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="form-actions">
            <button
              id="login-submit-btn"
              type="submit"
              className={`btn btn-primary btn-full${loading ? ' btn-loading' : ''}`}
              disabled={loading}
            >
              {!loading && 'Sign In'}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link href="/signup" id="login-signup-link">Create one free</Link>
        </div>
      </div>
    </div>
  );
}
