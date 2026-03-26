import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { registerUser } from '../../services/authService';
import { AUTH_ROLES, getRoleHome, ROLE_LABELS } from '../../utils/helpers';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen' });
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
      const data = await registerUser(form);
      login(data);
      navigate(getRoleHome(data.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-layout card">
        <aside className="login-about">
          <h1>Nyay-AI</h1>
          <p>Create your role-based account to access legal workflows and AI guidance.</p>
        </aside>

        <section className="login-card advanced">
          <h2>Register</h2>
          <p>Create a new account.</p>

          <form className="auth-form" onSubmit={onSubmit}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Full name"
              required
            />
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
              minLength={6}
              required
            />
            <select name="role" value={form.role} onChange={onChange} required>
              {AUTH_ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
            {error && <p className="error-text">{error}</p>}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : 'Register'}
            </button>
          </form>

          <Link to="/login" className="link-btn">Already have an account? Login</Link>
        </section>
      </section>
    </main>
  );
}
