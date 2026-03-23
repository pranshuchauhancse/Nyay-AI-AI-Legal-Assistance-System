import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="brand-wrap">
        <h1>Nyay-AI</h1>
        <p>Accessible Legal Intelligence</p>
      </div>
      <div className="user-actions">
        <span className="user-pill">{user?.name || 'Guest'}</span>
        <button type="button" className="btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
