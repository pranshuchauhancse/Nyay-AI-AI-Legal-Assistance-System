import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [now, setNow] = useState(() => new Date());
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pages = [
    { path: '/', label: 'Dashboard' },
    { path: '/cases', label: 'Cases' },
    { path: '/clients', label: 'Clients' },
    { path: '/appointments', label: 'Appointments' },
    { path: '/resources', label: 'Resources' },
  ];

  return (
    <header className="navbar">
      <div className="brand-wrap">
        <h1>Nyay-AI</h1>
        <p>Accessible Legal Intelligence</p>
        <small className="brand-copyright">Copyright © Rohit Chauhan</small>
      </div>

      <nav className="navbar-links">
        {pages.map((page) => (
          <Link key={page.path} to={page.path} className="nav-link">
            {page.label}
          </Link>
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
                <div className="user-email">{user?.email}</div>
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
