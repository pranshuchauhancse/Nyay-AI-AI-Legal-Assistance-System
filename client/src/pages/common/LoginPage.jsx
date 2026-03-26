import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginUser } from '../../services/authService';
import { getRoleHome, ROLE_LABELS, ROLES } from '../../utils/helpers';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', role: 'citizen' });
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
      const data = await loginUser(form);
      login(data);
      navigate(getRoleHome(data.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-layout card">
        <aside className="login-about">
          <h1>Nyay-AI</h1>
          <p>Role-based AI legal assistance system for citizens and legal authorities.</p>
          <ul className="plain-list">
            <li>Role-secure access for all legal stakeholders</li>
            <li>AI legal Q and A with practical guidance</li>
            <li>Case, hearing, report, and appointment workflows</li>
          </ul>
        </aside>

        <section className="login-card advanced">
          <h2>Login</h2>
          <p>Select your role and sign in.</p>

          <form className="auth-form" onSubmit={onSubmit}>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Password"
              required
            />
            <select name="role" value={form.role} onChange={onChange} required>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
            {error && <p className="error-text">{error}</p>}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : 'Login'}
            </button>
          </form>

          <Link to="/register" className="link-btn">Create new account</Link>
        </section>
      </section>
    </main>
  );
}
