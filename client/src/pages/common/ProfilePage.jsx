import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTemplate from '../PageTemplate';
import { useAuth } from '../../hooks/useAuth';
import { getProfile, updateProfile } from '../../services/authService';
import { ROLE_LABELS } from '../../utils/helpers';

const ROLE_SPECIFIC_FIELDS = {
  admin: ['department', 'licenseNumber', 'experience'],
  lawyer: ['licenseNumber', 'specialization', 'experience', 'officeAddress'],
  judge: ['courtName', 'yearsOfService', 'specialization'],
  police: ['badgeNumber', 'division', 'yearsOfService', 'rank'],
  citizen: ['phone', 'address', 'city'],
};

const FIELD_LABELS = {
  licenseNumber: 'License Number',
  specialization: 'Specialization',
  experience: 'Years of Experience',
  officeAddress: 'Office Address',
  courtName: 'Court Name',
  yearsOfService: 'Years of Service',
  badgeNumber: 'Badge Number',
  division: 'Division/Department',
  rank: 'Rank',
  department: 'Department',
  phone: 'Phone Number',
  address: 'Address',
  city: 'City',
};

const formatFieldValue = (value) => {
  if (value === null || value === undefined) return '';
  return String(value);
};

const getInitials = (name) => {
  const cleaned = String(name || '').trim();
  if (!cleaned) return 'U';
  const parts = cleaned.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join('') || 'U';
};

export default function ProfilePage() {
  const { user, login } = useAuth();
  const role = user?.role || 'citizen';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: string }

  const [form, setForm] = useState({ name: '', email: '' });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [roleFields, setRoleFields] = useState({});

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      setStatus(null);

      try {
        const data = await getProfile();
        if (!alive) return;

        setForm({
          name: formatFieldValue(data.name || user?.name),
          email: formatFieldValue(data.email || user?.email),
        });

        setAvatarPreview(formatFieldValue(data.profilePic));

        const nextRoleFields = {};
        (ROLE_SPECIFIC_FIELDS[role] || []).forEach((field) => {
          nextRoleFields[field] = formatFieldValue(data[field]);
        });
        setRoleFields(nextRoleFields);
      } catch {
        if (!alive) return;
        setStatus({ type: 'error', text: 'Could not load your profile right now.' });
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [role, user?.email, user?.name]);

  const stats = useMemo(() => {
    const base = [
      { label: 'Open Cases', value: 0 },
      { label: 'Appointments', value: 0 },
      { label: 'Documents', value: 0 },
      { label: 'Streak', value: '—' },
    ];

    if (role === 'lawyer') {
      return [
        { label: 'Assigned Cases', value: 0 },
        { label: 'Clients', value: 0 },
        { label: 'Meetings', value: 0 },
        { label: 'Win Rate', value: '—' },
      ];
    }

    if (role === 'judge') {
      return [
        { label: 'Active Hearings', value: 0 },
        { label: 'Pending Judgments', value: 0 },
        { label: 'Court Days', value: '—' },
        { label: 'Streak', value: '—' },
      ];
    }

    if (role === 'police') {
      return [
        { label: 'FIRs', value: 0 },
        { label: 'Investigations', value: 0 },
        { label: 'Reports', value: 0 },
        { label: 'Resolution', value: '—' },
      ];
    }

    if (role === 'admin') {
      return [
        { label: 'Users', value: 0 },
        { label: 'Cases', value: 0 },
        { label: 'Reports', value: 0 },
        { label: 'Health', value: '—' },
      ];
    }

    return base;
  }, [role]);

  const onAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(String(reader.result || ''));
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const updateData = {
        name: form.name,
        email: form.email,
        profilePic: avatarPreview || null,
        ...roleFields,
      };

      const updated = await updateProfile(updateData);
      login(updated);
      setStatus({ type: 'success', text: 'Profile updated successfully.' });
      setTimeout(() => setStatus(null), 2500);
    } catch (error) {
      setStatus({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  const profileName = form.name || user?.name || 'User';
  const profileEmail = form.email || user?.email || '';
  const roleLabel = ROLE_LABELS[role] || 'User';

  return (
    <PageTemplate title="Profile" description="LeetCode-style account overview and profile controls.">
      <div className="lc-layout">
        <aside className="lc-sidebar">
          <section className="lc-card lc-profile-card">
            <div className="lc-profile-head">
              <div className="lc-avatar" aria-label="Profile avatar">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" />
                ) : (
                  <span>{getInitials(profileName)}</span>
                )}
              </div>

              <div className="lc-profile-meta">
                <h3>{profileName}</h3>
                <p>{profileEmail}</p>
                <span className="lc-pill">{roleLabel}</span>
              </div>
            </div>

            <div className="lc-actions-row">
              <label className="lc-btn-secondary" htmlFor="profile-avatar-upload">
                Change photo
                <input
                  id="profile-avatar-upload"
                  className="lc-hidden-input"
                  type="file"
                  accept="image/*"
                  onChange={onAvatarChange}
                />
              </label>
              <button
                className="lc-btn-ghost"
                type="button"
                onClick={() => setAvatarPreview('')}
                disabled={!avatarPreview}
                aria-disabled={!avatarPreview}
              >
                Remove
              </button>
            </div>

            <p className="lc-muted">
              Your profile photo is used across dashboards and shared case views.
            </p>
          </section>

          <section className="lc-card">
            <div className="lc-card-title">Quick stats</div>
            <div className="lc-stat-grid" aria-label="Quick stats">
              {stats.map((item) => (
                <div key={item.label} className="lc-stat">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="lc-card">
            <div className="lc-card-title">Tips</div>
            <ul className="lc-mini-list">
              <li>Keep your email updated for case alerts.</li>
              <li>Add role details to unlock better suggestions.</li>
              <li>Use Settings for notifications and privacy.</li>
            </ul>
          </section>
        </aside>

        <section className="lc-main">
          <section className="lc-card lc-topbar">
            <div className="lc-topbar-title">
              <h3>Account</h3>
              <p className="lc-muted">Profile and preferences in one place.</p>
            </div>
            <div className="lc-tabs" role="tablist" aria-label="Account tabs">
              <Link to="/profile" className="lc-tab active" role="tab" aria-selected="true">
                Profile
              </Link>
              <Link to="/settings" className="lc-tab" role="tab" aria-selected="false">
                Settings
              </Link>
            </div>
          </section>

          <section className="lc-card">
            <div className="lc-card-head">
              <div>
                <h3>Account details</h3>
                <p>Update your basic information and role-specific details.</p>
              </div>
              <div className="lc-card-head-right">
                {loading ? <span className="lc-skeleton-pill">Loading…</span> : null}
              </div>
            </div>

            <form className="lc-form" onSubmit={onSubmit}>
              <div className="lc-row-2">
                <div className="lc-field">
                  <label htmlFor="profile-name">Name</label>
                  <input
                    id="profile-name"
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Full name"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="lc-field">
                  <label htmlFor="profile-email">Email</label>
                  <input
                    id="profile-email"
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="Email address"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {(ROLE_SPECIFIC_FIELDS[role] || []).length > 0 ? (
                <>
                  <div className="lc-divider" />
                  <div className="lc-subhead">
                    <h4>{roleLabel} info</h4>
                    <p>Shown in role workflows and relevant dashboards.</p>
                  </div>

                  <div className="lc-row-2">
                    {(ROLE_SPECIFIC_FIELDS[role] || []).map((field) => {
                      const label = FIELD_LABELS[field] || field;
                      const isLongText = field === 'officeAddress' || field === 'address';
                      const isNumber = field === 'yearsOfService' || field === 'experience';
                      const isPhone = field === 'phone';

                      return (
                        <div className="lc-field" key={field}>
                          <label htmlFor={`role-${field}`}>{label}</label>
                          {isLongText ? (
                            <textarea
                              id={`role-${field}`}
                              value={roleFields[field] || ''}
                              onChange={(event) =>
                                setRoleFields((prev) => ({ ...prev, [field]: event.target.value }))
                              }
                              placeholder={label}
                              rows={3}
                              disabled={loading}
                            />
                          ) : (
                            <input
                              id={`role-${field}`}
                              type={isPhone ? 'tel' : isNumber ? 'number' : 'text'}
                              value={roleFields[field] || ''}
                              onChange={(event) =>
                                setRoleFields((prev) => ({ ...prev, [field]: event.target.value }))
                              }
                              placeholder={label}
                              disabled={loading}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}

              <div className="lc-actions-bar">
                <button className="btn-primary" type="submit" disabled={saving || loading}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>

                {status ? (
                  <div className={`lc-alert ${status.type}`} role="status">
                    {status.text}
                  </div>
                ) : null}
              </div>
            </form>
          </section>

          <section className="lc-card">
            <div className="lc-card-head">
              <div>
                <h3>Security</h3>
                <p>More security options are available in Settings.</p>
              </div>
            </div>

            <div className="lc-security-grid">
              <div className="lc-security-item">
                <div>
                  <strong>Password</strong>
                  <span className="lc-muted">Managed by your account provider</span>
                </div>
                <span className="lc-pill lc-pill-muted">Coming soon</span>
              </div>

              <div className="lc-security-item">
                <div>
                  <strong>Two-factor auth</strong>
                  <span className="lc-muted">Add an extra layer of security</span>
                </div>
                <span className="lc-pill lc-pill-muted">Coming soon</span>
              </div>
            </div>
          </section>
        </section>
      </div>
    </PageTemplate>
  );
}
