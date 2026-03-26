import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getRoleLinks, ROLE_LABELS } from '../utils/helpers';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [now, setNow] = useState(() => new Date());
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pages = getRoleLinks(user?.role);

  return (
    <header className="navbar">
      <div className="brand-wrap">
        <h1>Nyay-AI</h1>
        <p>Accessible Legal Intelligence</p>
        <small className="brand-copyright"></small>
      </div>

      <nav className="navbar-links">
        {pages.map((page) => (
          <NavLink
            key={page.to}
            to={page.to}
            end={page.to.endsWith('/dashboard')}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {page.label}
          </NavLink>
        ))}
      </nav>

      <div className="user-actions">
        <span className="clock-pill">{now.toLocaleString('en-IN')}</span>

        <div className="account-dropdown">
          <button
            className="user-pill"
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            type="button"
          >
            {user?.name || 'Guest'} ▼
          </button>

          {showAccountMenu && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div className="user-name">{user?.name}</div>
                <div className="user-email">{user?.email} | {ROLE_LABELS[user?.role] || 'User'}</div>
              </div>
              <hr />
              <Link
                to="/profile"
                className="dropdown-item"
                onClick={() => setShowAccountMenu(false)}
              >
                Profile & Account
              </Link>
              <Link
                to="/settings"
                className="dropdown-item"
                onClick={() => setShowAccountMenu(false)}
              >
                Settings
              </Link>
              <hr />
              <button
                className="dropdown-item danger"
                onClick={() => {
                  logout();
                  setShowAccountMenu(false);
                  navigate('/login');
                }}
                type="button"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
