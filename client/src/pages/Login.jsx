import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [form, setForm] = useState({
    name: 'Advocate Demo',
    email: 'demo@nyay.ai',
    password: '123456',
  });
  const [isRegister, setIsRegister] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const { data } = await api.post(endpoint, payload);

      if (!rememberMe) {
        localStorage.removeItem('nyay_user');
        localStorage.removeItem('nyay_token');
      }

      login(data);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Sign in is temporarily unavailable. Please try again shortly.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setForm({
      name: 'Advocate Demo',
      email: 'demo@nyay.ai',
      password: '123456',
    });
  };

  return (
    <main className="login-shell">
      <section className="login-layout card">
        <aside className="login-about">
          <h1>Nyay-AI</h1>
          <p>
            Legal technology platform that makes case operations, client handling,
            appointments, and legal query support fast and organized.
          </p>
          <ul className="plain-list">
            <li>AI legal guidance with context-aware responses</li>
            <li>Advanced case dashboard with workload analytics</li>
            <li>Client and appointment management in one place</li>
            <li>Secure access with JWT authentication</li>
          </ul>
          <article className="summary-item login-highlight">
            <span>Vision</span>
            <strong>Accessible justice through practical technology.</strong>
          </article>
        </aside>

        <section className="login-card advanced">
          <h2>{isRegister ? 'Create Your Account' : 'Welcome Back'}</h2>
          <p>Secure sign in for legal operations, references, and case workflows.</p>

          <form onSubmit={onSubmit} className="auth-form">
            {isRegister && (
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Full name"
                required
              />
            )}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email"
              required
            />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Password"
              required
            />

            <label className="toggle-row">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Show password
            </label>

            <label className="toggle-row">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me on this device
            </label>

            {error && <p className="error-text">{error}</p>}

            <div className="action-row">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Login'}
              </button>
              <button type="button" className="btn-secondary" onClick={logout}>
                Logout
              </button>
              <button type="button" className="btn-secondary" onClick={fillDemo}>
                Use Demo Credentials
              </button>
            </div>
          </form>

          <button
            type="button"
            className="link-btn"
            onClick={() => setIsRegister((prev) => !prev)}
          >
            {isRegister ? 'Have an account? Login' : 'New here? Register'}
          </button>

          <small className="login-copyright">Copyright © 2026 Rohit Chauhan</small>
        </section>
      </section>
    </main>
  );
}
