import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTemplate from '../PageTemplate';
import { useAuth } from '../../hooks/useAuth';
import { getProfile, updateProfile } from '../../services/authService';
import api from '../../services/api';
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

  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState('');
  const [activity, setActivity] = useState({
    cases: [],
    appointments: [],
    reports: [],
    clients: [],
  });

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

  useEffect(() => {
    let alive = true;

    const loadActivity = async () => {
      setActivityLoading(true);
      setActivityError('');

      const wantsAppointments = role === 'citizen' || role === 'lawyer';
      const wantsReports = role === 'police' || role === 'admin' || role === 'judge';
      const wantsClients = role === 'lawyer';

      try {
        const [casesRes, appointmentsRes, reportsRes, clientsRes] = await Promise.all([
          api.get('/cases'),
          wantsAppointments ? api.get('/appointments') : Promise.resolve({ data: [] }),
          wantsReports ? api.get('/reports') : Promise.resolve({ data: [] }),
          wantsClients ? api.get('/clients') : Promise.resolve({ data: [] }),
        ]);

        if (!alive) return;
        setActivity({
          cases: casesRes.data || [],
          appointments: appointmentsRes.data || [],
          reports: reportsRes.data || [],
          clients: clientsRes.data || [],
        });
      } catch {
        if (!alive) return;
        setActivityError('Could not load activity right now.');
      } finally {
        if (!alive) return;
        setActivityLoading(false);
      }
    };

    loadActivity();
    return () => {
      alive = false;
    };
  }, [role]);

  const caseCounts = useMemo(() => {
    const total = activity.cases.length;
    const open = activity.cases.filter(
      (item) => item?.status && !['Resolved', 'Closed'].includes(String(item.status))
    ).length;
    const highPriority = activity.cases.filter((item) => item?.priority === 'High').length;
    return { total, open, highPriority };
  }, [activity.cases]);

  const appointmentCounts = useMemo(() => {
    const total = activity.appointments.length;
    const now = Date.now();
    const upcoming = activity.appointments.filter((item) => {
      const time = item?.appointmentDate ? new Date(item.appointmentDate).getTime() : 0;
      return time >= now && item?.status !== 'Cancelled';
    }).length;
    return { total, upcoming };
  }, [activity.appointments]);

  const reportCounts = useMemo(() => {
    const total = activity.reports.length;
    const submitted = activity.reports.filter((item) => item?.status === 'Submitted').length;
    return { total, submitted };
  }, [activity.reports]);

  const clientCounts = useMemo(() => {
    const total = activity.clients.length;
    const withPhone = activity.clients.filter((item) => Boolean(item?.phone)).length;
    return { total, withPhone };
  }, [activity.clients]);

  const stats = useMemo(() => {
    if (role === 'lawyer') {
      return [
        { label: 'Open Cases', value: caseCounts.open },
        { label: 'Clients', value: clientCounts.total },
        { label: 'Upcoming', value: appointmentCounts.upcoming },
        { label: 'High Priority', value: caseCounts.highPriority },
      ];
    }

    if (role === 'judge') {
      const upcomingHearings = activity.cases.filter((item) => {
        const time = item?.nextHearingDate ? new Date(item.nextHearingDate).getTime() : 0;
        return time >= Date.now();
      }).length;
      const inHearing = activity.cases.filter((item) => item?.status === 'In Hearing').length;
      return [
        { label: 'Cases', value: caseCounts.total },
        { label: 'In Hearing', value: inHearing },
        { label: 'Upcoming Hearings', value: upcomingHearings },
        { label: 'High Priority', value: caseCounts.highPriority },
      ];
    }

    if (role === 'police') {
      const firs = activity.reports.filter((item) => item?.type === 'FIR').length;
      const investigations = activity.reports.filter((item) => item?.type === 'Investigation').length;
      return [
        { label: 'Open Cases', value: caseCounts.open },
        { label: 'FIRs', value: firs },
        { label: 'Investigations', value: investigations },
        { label: 'Submitted', value: reportCounts.submitted },
      ];
    }

    if (role === 'admin') {
      return [
        { label: 'Cases', value: caseCounts.total },
        { label: 'Open Cases', value: caseCounts.open },
        { label: 'Reports', value: reportCounts.total },
        { label: 'High Priority', value: caseCounts.highPriority },
      ];
    }

    return [
      { label: 'Open Cases', value: caseCounts.open },
      { label: 'All Cases', value: caseCounts.total },
      { label: 'Upcoming', value: appointmentCounts.upcoming },
      { label: 'Reports', value: reportCounts.total },
    ];
  }, [
    activity.cases,
    activity.reports,
    appointmentCounts.upcoming,
    caseCounts.highPriority,
    caseCounts.open,
    caseCounts.total,
    clientCounts.total,
    reportCounts.submitted,
    reportCounts.total,
    role,
  ]);

  const roleActions = useMemo(() => {
    if (role === 'lawyer') {
      return [
        { label: 'Assigned Cases', to: '/lawyer/assigned-cases' },
        { label: 'Client List', to: '/lawyer/client-list' },
        { label: 'Schedule Meeting', to: '/lawyer/schedule-meeting' },
        { label: 'Dashboard', to: '/lawyer/dashboard' },
      ];
    }

    if (role === 'judge') {
      return [
        { label: 'Case List', to: '/judge/case-list' },
        { label: 'Hearing Schedule', to: '/judge/hearing-schedule' },
        { label: 'Update Judgment', to: '/judge/update-judgment' },
        { label: 'Dashboard', to: '/judge/dashboard' },
      ];
    }

    if (role === 'police') {
      return [
        { label: 'FIR Complaints', to: '/police/fir-complaints' },
        { label: 'Investigation Status', to: '/police/investigation-status' },
        { label: 'Upload Reports', to: '/police/upload-reports' },
        { label: 'Dashboard', to: '/police/dashboard' },
      ];
    }

    if (role === 'admin') {
      return [
        { label: 'Manage Users', to: '/admin/manage-users' },
        { label: 'All Cases', to: '/admin/all-cases' },
        { label: 'Reports', to: '/admin/reports' },
        { label: 'Dashboard', to: '/admin/dashboard' },
      ];
    }

    return [
      { label: 'My Cases', to: '/citizen/my-cases' },
      { label: 'Case Status', to: '/citizen/case-status' },
      { label: 'Book Appointment', to: '/citizen/book-appointment' },
      { label: 'Dashboard', to: '/citizen/dashboard' },
    ];
  }, [role]);

  const formatWhen = (value) => {
    if (!value) return '';
    const time = new Date(value);
    if (Number.isNaN(time.getTime())) return '';
    return time.toLocaleString('en-IN');
  };

  const activitySections = useMemo(() => {
    const sections = [
      { id: 'cases', title: 'Cases' },
    ];

    if (role === 'citizen' || role === 'lawyer') sections.push({ id: 'appointments', title: 'Appointments' });
    if (role === 'police' || role === 'admin' || role === 'judge') sections.push({ id: 'reports', title: 'Reports' });
    if (role === 'lawyer') sections.push({ id: 'clients', title: 'Clients' });

    return sections;
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
                  <strong>{activityLoading ? '—' : item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            {activityError ? <div className="lc-alert error" role="status">{activityError}</div> : null}
          </section>

          <section className="lc-card">
            <div className="lc-card-title">{roleLabel} shortcuts</div>
            <div className="lc-link-grid" aria-label="Role shortcuts">
              {roleActions.map((action) => (
                <Link key={action.to} to={action.to} className="lc-link-card">
                  <span>{action.label}</span>
                  <small>{action.to}</small>
                </Link>
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
                <h3>Recent activity</h3>
                <p>Latest items visible to your role.</p>
              </div>
              <div className="lc-card-head-right">
                {activityLoading ? <span className="lc-skeleton-pill">Loading…</span> : null}
              </div>
            </div>

            <div className="lc-activity-grid">
              {activitySections.map((section) => {
                if (section.id === 'cases') {
                  return (
                    <div key={section.id} className="lc-activity-col">
                      <div className="lc-activity-title">{section.title}</div>
                      <div className="lc-list">
                        {(activity.cases || []).slice(0, 5).map((item) => (
                          <div key={item._id} className="lc-list-item">
                            <div className="lc-list-main">
                              <strong>{item.title || 'Untitled case'}</strong>
                              <small>{item.caseType || 'Case'}</small>
                            </div>
                            <div className="lc-list-meta">
                              <span className="lc-tag">{item.status || 'Filed'}</span>
                              <small>{formatWhen(item.updatedAt || item.createdAt)}</small>
                            </div>
                          </div>
                        ))}
                        {!activityLoading && !(activity.cases || []).length ? (
                          <div className="lc-empty">No cases yet.</div>
                        ) : null}
                      </div>
                    </div>
                  );
                }

                if (section.id === 'appointments') {
                  return (
                    <div key={section.id} className="lc-activity-col">
                      <div className="lc-activity-title">{section.title}</div>
                      <div className="lc-list">
                        {(activity.appointments || []).slice(0, 5).map((item) => (
                          <div key={item._id} className="lc-list-item">
                            <div className="lc-list-main">
                              <strong>{item.title || 'Appointment'}</strong>
                              <small>{formatWhen(item.appointmentDate)}</small>
                            </div>
                            <div className="lc-list-meta">
                              <span className="lc-tag">{item.status || 'Pending'}</span>
                            </div>
                          </div>
                        ))}
                        {!activityLoading && !(activity.appointments || []).length ? (
                          <div className="lc-empty">No appointments yet.</div>
                        ) : null}
                      </div>
                    </div>
                  );
                }

                if (section.id === 'reports') {
                  return (
                    <div key={section.id} className="lc-activity-col">
                      <div className="lc-activity-title">{section.title}</div>
                      <div className="lc-list">
                        {(activity.reports || []).slice(0, 5).map((item) => (
                          <div key={item._id} className="lc-list-item">
                            <div className="lc-list-main">
                              <strong>{item.title || 'Report'}</strong>
                              <small>{item.type || 'Report'}</small>
                            </div>
                            <div className="lc-list-meta">
                              <span className="lc-tag">{item.status || 'Draft'}</span>
                              <small>{formatWhen(item.updatedAt || item.createdAt)}</small>
                            </div>
                          </div>
                        ))}
                        {!activityLoading && !(activity.reports || []).length ? (
                          <div className="lc-empty">No reports yet.</div>
                        ) : null}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={section.id} className="lc-activity-col">
                    <div className="lc-activity-title">{section.title}</div>
                    <div className="lc-list">
                      {(activity.clients || []).slice(0, 5).map((item) => (
                        <div key={item._id} className="lc-list-item">
                          <div className="lc-list-main">
                            <strong>{item.name || 'Client'}</strong>
                            <small>{item.email || item.phone || 'No contact info'}</small>
                          </div>
                          <div className="lc-list-meta">
                            <small>{formatWhen(item.updatedAt || item.createdAt)}</small>
                          </div>
                        </div>
                      ))}
                      {!activityLoading && !(activity.clients || []).length ? (
                        <div className="lc-empty">No clients yet.</div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
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
