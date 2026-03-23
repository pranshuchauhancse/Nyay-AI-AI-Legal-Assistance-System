import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: 'Advocate Demo',
    email: 'demo@nyay.ai',
    password: '123456',
  });
  const [isRegister, setIsRegister] = useState(false);
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
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-card">
        <h1>Nyay-AI</h1>
        <p>Sign in to manage cases, clients, and legal queries.</p>
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
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="Password"
            required
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Login'}
          </button>
        </form>
        <button
          type="button"
          className="link-btn"
          onClick={() => setIsRegister((prev) => !prev)}
        >
          {isRegister ? 'Have an account? Login' : 'New here? Register'}
        </button>
      </section>
    </main>
  );
}
