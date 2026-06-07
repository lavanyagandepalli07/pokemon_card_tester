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

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error: authError } = await signUp(email, password, name || undefined);
    setLoading(false);

    if (authError) {
      setError(authError.includes('already registered') ? 'An account with this email already exists.' : authError);
      return;
    }

    setSuccess(true);
    // Give Supabase auth state time to propagate then redirect
    setTimeout(() => router.push('/dashboard'), 1200);
  };

  return (
    <div className="auth-page">
      <div className="auth-card card card-glow fade-in">
        <div className="auth-header">
          <div className="auth-logo">✨</div>
          <h1 className="auth-title" style={{ fontSize: '1.75rem' }}>Create your account</h1>
          <p className="auth-subtitle">Start authenticating Pokémon cards with AI</p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: '1rem' }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="status" style={{ marginBottom: '1rem' }}>
            <span>✅</span>
            <span>Account created! Redirecting to dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="signup-name" className="form-label">Name <span style={{ color: 'var(--color-text-faint)' }}>(optional)</span></label>
            <input
              id="signup-name"
              type="text"
              className="form-input"
              placeholder="Ash Ketchum"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-email" className="form-label">Email address <span style={{ color: 'var(--color-danger)', fontSize: '0.7rem' }}>*</span></label>
            <input
              id="signup-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-password" className="form-label">Password <span style={{ color: 'var(--color-danger)', fontSize: '0.7rem' }}>*</span></label>
            <input
              id="signup-password"
              type="password"
              className="form-input"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            {password && (
              <>
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{ width: `${(strength.score / 4) * 100}%`, background: strength.color }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: strength.color }}>{strength.label}</span>
              </>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="signup-confirm-password" className="form-label">Confirm password <span style={{ color: 'var(--color-danger)', fontSize: '0.7rem' }}>*</span></label>
            <input
              id="signup-confirm-password"
              type="password"
              className={`form-input${confirmPassword && confirmPassword !== password ? ' error' : ''}`}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            {confirmPassword && confirmPassword !== password && (
              <span className="form-error">✗ Passwords don't match</span>
            )}
            {confirmPassword && confirmPassword === password && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>✓ Passwords match</span>
            )}
          </div>

          <div className="form-actions">
            <button
              id="signup-submit-btn"
              type="submit"
              className={`btn btn-primary btn-full${loading ? ' btn-loading' : ''}`}
              disabled={loading || success}
            >
              {!loading && !success && 'Create Account'}
              {success && ''}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link href="/login" id="signup-login-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
