import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setForm({ name: data.name || '', email: data.email || '' });
      } catch {
        setForm({
          name: user?.name || '',
          email: user?.email || '',
        });
      }
    };

    loadProfile();
  }, [user?.email, user?.name]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        name: form.name,
        email: form.email,
      };

      const { data } = await api.put('/auth/me', payload);
      login(data);
      setIsEditing(false);
      setMessage('✓ Profile updated successfully.');
    } catch (error) {
      setMessage('✗ ' + (error.response?.data?.message || 'Could not update profile right now.'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('✗ Passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage('✗ Password must be at least 6 characters.');
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage('');

    try {
      await api.put('/auth/me', {
        password: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
      setPasswordMessage('✓ Password changed successfully.');
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (error) {
      setPasswordMessage('✗ ' + (error.response?.data?.message || 'Could not change password.'));
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <section className="profile-card">
        <div className="profile-header">
          <div>
            <h2>Account Summary</h2>
            <p className="text-muted">View and manage your profile information</p>
          </div>
          {!isEditing && (
            <button
              className="btn-primary"
              onClick={() => setIsEditing(true)}
              type="button"
            >
              ✎ Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="profile-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setMessage('');
                }}
              >
                ✕ Cancel
              </button>
            </div>

            {message && <p className={`form-message ${message.includes('✓') ? 'success' : 'error'}`}>{message}</p>}
          </form>
        ) : (
          <div className="profile-display">
            <div className="profile-field">
              <span className="field-label">Full Name</span>
              <span className="field-value">{form.name}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Email Address</span>
              <span className="field-value">{form.email}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Legal Role</span>
              <span className="field-value badge-primary">{user?.role === 'admin' ? '⭐ Administrator' : '⚖️ ' + (user?.role || 'Lawyer')}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Account Status</span>
              <span className="field-value badge-success">✓ Active</span>
            </div>
          </div>
        )}
      </section>

      <section className="security-card">
        <div className="security-header">
          <div>
            <h3>🔐 Security Settings</h3>
            <p className="text-muted">Manage your password and security preferences</p>
          </div>
        </div>

        {!showPasswordChange ? (
          <div className="security-info">
            <div className="security-item">
              <span className="security-label">Password</span>
              <span className="security-status">••••••••</span>
            </div>
            <button
              className="btn-secondary"
              onClick={() => setShowPasswordChange(true)}
              type="button"
            >
              🔑 Change Password
            </button>
          </div>
        ) : (
          <form className="password-form" onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>New Password *</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
                required
              />
            </div>

            <div className="profile-actions">
              <button type="submit" className="btn-primary" disabled={passwordLoading}>
                {passwordLoading ? '⏳ Updating...' : '✓ Update Password'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowPasswordChange(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordMessage('');
                }}
              >
                ✕ Cancel
              </button>
            </div>

            {passwordMessage && <p className={`form-message ${passwordMessage.includes('✓') ? 'success' : 'error'}`}>{passwordMessage}</p>}
          </form>
        )}
      </section>
    </div>
  );
}
