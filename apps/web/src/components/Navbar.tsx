'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href={user ? '/dashboard' : '/'} className="navbar-brand">
          <span className="navbar-logo">⚡</span>
          <span className="navbar-title">PokéAuth</span>
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link href="/dashboard" className="nav-link">Dashboard</Link>
              <Link href="/upload" className="nav-link">Scan Card</Link>
              <div className="navbar-user">
                <Link href="/profile" className="nav-user-btn">
                  <div className="nav-avatar">
                    {user.email?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="nav-email">{user.email}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-sm" id="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link">Login</Link>
              <Link href="/signup" className="btn btn-primary btn-sm" id="signup-nav-btn">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
