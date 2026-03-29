import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTemplate from '../PageTemplate';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../utils/helpers';

const SETTINGS_KEY = 'nyay_settings_v1';

const DEFAULT_SETTINGS = {
  autoRefreshDashboard: true,
  emailNotifications: true,
  caseUpdates: true,
  soundEffects: false,
  compactLayout: false,
  language: 'en',
  timezone: 'Asia/Kolkata',
  sessionTimeoutMins: 30,
  publicProfile: false,

  // Role-specific (stored locally)
  lawyerDefaultMeetingMins: 30,
  lawyerShowClientContact: true,
  judgeAutoRefreshSchedule: true,
  policeDefaultReportType: 'Investigation',
  adminShowSystemAlerts: true,
  citizenHearingReminders: true,
};

const safeParseJson = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const loadSettings = () => {
  const stored = safeParseJson(localStorage.getItem(SETTINGS_KEY));
  if (!stored || typeof stored !== 'object') return { ...DEFAULT_SETTINGS };
  return { ...DEFAULT_SETTINGS, ...stored };
};

const saveSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

function ToggleRow({ id, label, description, checked, onChange }) {
  return (
    <div className="lc-setting-row">
      <div className="lc-setting-info">
        <label className="lc-setting-label" htmlFor={id}>
          {label}
        </label>
        {description ? <p className="lc-setting-desc">{description}</p> : null}
      </div>

      <label className="toggle-switch" aria-label={label}>
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="toggle-slider" />
      </label>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const role = user?.role || 'citizen';
  const [active, setActive] = useState('general');
  const [settings, setSettings] = useState(() => DEFAULT_SETTINGS);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const roleTab = useMemo(() => {
    if (role === 'lawyer') return { id: 'practice', label: 'Practice' };
    if (role === 'judge') return { id: 'court', label: 'Court' };
    if (role === 'police') return { id: 'investigation', label: 'Investigation' };
    if (role === 'admin') return { id: 'governance', label: 'Governance' };
    return { id: 'citizen', label: 'Case Tracking' };
  }, [role]);

  const nav = useMemo(() => {
    return [
      { id: 'general', label: 'General' },
      { id: 'notifications', label: 'Notifications' },
      { id: roleTab.id, label: roleTab.label },
      { id: 'privacy', label: 'Privacy' },
      { id: 'display', label: 'Display' },
      { id: 'data', label: 'Data' },
    ];
  }, [roleTab.id, roleTab.label]);

  const onSave = (event) => {
    event.preventDefault();
    saveSettings(settings);
    setMessage('Settings saved.');
    setTimeout(() => setMessage(''), 2000);
  };

  const set = (key) => (value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const roleLabel = ROLE_LABELS[role] || 'User';

  const onReset = () => {
    const next = { ...DEFAULT_SETTINGS };
    setSettings(next);
    saveSettings(next);
    setMessage('Settings reset to defaults.');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <PageTemplate title="Settings" description="LeetCode-style preferences: quick, clean, and organized.">
      <form onSubmit={onSave} className="lc-settings-shell">
        <aside className="lc-card lc-settings-nav">
          <div className="lc-card-title">Preferences</div>
          <div className="lc-nav">
            {nav.map((item) => (
              <button
                key={item.id}
                type="button"
                className={active === item.id ? 'lc-nav-btn active' : 'lc-nav-btn'}
                onClick={() => setActive(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="lc-muted">
            These settings are stored in your browser for now.
          </p>
        </aside>

        <section className="lc-main">
          <section className="lc-card lc-topbar">
            <div className="lc-topbar-title">
              <h3>Account</h3>
              <p className="lc-muted">Profile and preferences in one place.</p>
            </div>
            <div className="lc-tabs" role="tablist" aria-label="Account tabs">
              <Link to="/profile" className="lc-tab" role="tab" aria-selected="false">
                Profile
              </Link>
              <Link to="/settings" className="lc-tab active" role="tab" aria-selected="true">
                Settings
              </Link>
            </div>
          </section>

          <section className="lc-card">
            <div className="lc-card-head">
              <div>
                <h3>Signed in</h3>
                <p>Your role controls what you see across Nyay-AI.</p>
              </div>
            </div>
            <div className="lc-activity-grid">
              <div className="lc-activity-col">
                <div className="lc-activity-title">Account</div>
                <div className="lc-list">
                  <div className="lc-list-item">
                    <div className="lc-list-main">
                      <strong>{user?.name || 'User'}</strong>
                      <small>{user?.email || ''}</small>
                    </div>
                    <div className="lc-list-meta">
                      <span className="lc-tag">{roleLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lc-activity-col">
                <div className="lc-activity-title">Quick links</div>
                <div className="lc-link-grid">
                  <Link to="/chatbot" className="lc-link-card">
                    <span>Chatbot</span>
                    <small>/chatbot</small>
                  </Link>
                  <Link to="/profile" className="lc-link-card">
                    <span>Profile</span>
                    <small>/profile</small>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {active === 'general' ? (
            <section className="lc-card">
              <div className="lc-card-head">
                <div>
                  <h3>General</h3>
                  <p>Core behavior for dashboards and session.</p>
                </div>
              </div>

              <ToggleRow
                id="autoRefreshDashboard"
                label="Auto refresh dashboard"
                description="Refresh dashboard data automatically while you stay on the page."
                checked={settings.autoRefreshDashboard}
                onChange={set('autoRefreshDashboard')}
              />

              <div className="lc-setting-row">
                <div className="lc-setting-info">
                  <label className="lc-setting-label" htmlFor="sessionTimeoutMins">
                    Session timeout
                  </label>
                  <p className="lc-setting-desc">Auto-logout after inactivity (in minutes).</p>
                </div>

                <div className="setting-input-group">
                  <input
                    id="sessionTimeoutMins"
                    className="setting-input"
                    type="number"
                    min={5}
                    max={240}
                    value={settings.sessionTimeoutMins}
                    onChange={(e) => set('sessionTimeoutMins')(Number(e.target.value || 0))}
                  />
                  <span className="input-unit">mins</span>
                </div>
              </div>

              <div className="lc-setting-row">
                <div className="lc-setting-info">
                  <label className="lc-setting-label" htmlFor="language">
                    Language
                  </label>
                  <p className="lc-setting-desc">UI language selection.</p>
                </div>

                <select
                  id="language"
                  className="setting-select"
                  value={settings.language}
                  onChange={(e) => set('language')(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>

              <div className="lc-setting-row">
                <div className="lc-setting-info">
                  <label className="lc-setting-label" htmlFor="timezone">
                    Timezone
                  </label>
                  <p className="lc-setting-desc">Used for dates and scheduling display.</p>
                </div>

                <select
                  id="timezone"
                  className="setting-select"
                  value={settings.timezone}
                  onChange={(e) => set('timezone')(e.target.value)}
                >
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </section>
          ) : null}

          {active === 'notifications' ? (
            <section className="lc-card">
              <div className="lc-card-head">
                <div>
                  <h3>Notifications</h3>
                  <p>Control what updates you receive.</p>
                </div>
              </div>

              <ToggleRow
                id="emailNotifications"
                label="Email notifications"
                description="Get important updates sent to your email."
                checked={settings.emailNotifications}
                onChange={set('emailNotifications')}
              />

              <ToggleRow
                id="caseUpdates"
                label="Case status updates"
                description="Notify when case status changes or hearings are scheduled."
                checked={settings.caseUpdates}
                onChange={set('caseUpdates')}
              />

              <ToggleRow
                id="soundEffects"
                label="Sound effects"
                description="Enable subtle sounds for actions and alerts."
                checked={settings.soundEffects}
                onChange={set('soundEffects')}
              />
            </section>
          ) : null}

          {active === roleTab.id ? (
            <section className="lc-card">
              <div className="lc-card-head">
                <div>
                  <h3>{roleTab.label}</h3>
                  <p>Role-specific preferences for your workflows.</p>
                </div>
              </div>

              {role === 'lawyer' ? (
                <>
                  <ToggleRow
                    id="lawyerShowClientContact"
                    label="Show client contact info"
                    description="Display client email/phone prominently in lists."
                    checked={settings.lawyerShowClientContact}
                    onChange={set('lawyerShowClientContact')}
                  />

                  <div className="lc-setting-row">
                    <div className="lc-setting-info">
                      <label className="lc-setting-label" htmlFor="lawyerDefaultMeetingMins">
                        Default meeting length
                      </label>
                      <p className="lc-setting-desc">Used as a suggested duration for meetings.</p>
                    </div>
                    <div className="setting-input-group">
                      <input
                        id="lawyerDefaultMeetingMins"
                        className="setting-input"
                        type="number"
                        min={10}
                        max={180}
                        value={settings.lawyerDefaultMeetingMins}
                        onChange={(e) => set('lawyerDefaultMeetingMins')(Number(e.target.value || 0))}
                      />
                      <span className="input-unit">mins</span>
                    </div>
                  </div>
                </>
              ) : null}

              {role === 'judge' ? (
                <ToggleRow
                  id="judgeAutoRefreshSchedule"
                  label="Auto refresh hearing schedule"
                  description="Keep the hearing schedule up to date while the page is open."
                  checked={settings.judgeAutoRefreshSchedule}
                  onChange={set('judgeAutoRefreshSchedule')}
                />
              ) : null}

              {role === 'police' ? (
                <div className="lc-setting-row">
                  <div className="lc-setting-info">
                    <label className="lc-setting-label" htmlFor="policeDefaultReportType">
                      Default report type
                    </label>
                    <p className="lc-setting-desc">Preselect a report type when uploading reports.</p>
                  </div>
                  <select
                    id="policeDefaultReportType"
                    className="setting-select"
                    value={settings.policeDefaultReportType}
                    onChange={(e) => set('policeDefaultReportType')(e.target.value)}
                  >
                    <option value="FIR">FIR</option>
                    <option value="Investigation">Investigation</option>
                  </select>
                </div>
              ) : null}

              {role === 'admin' ? (
                <ToggleRow
                  id="adminShowSystemAlerts"
                  label="Show system alerts"
                  description="Display important admin alerts on dashboards."
                  checked={settings.adminShowSystemAlerts}
                  onChange={set('adminShowSystemAlerts')}
                />
              ) : null}

              {role === 'citizen' ? (
                <ToggleRow
                  id="citizenHearingReminders"
                  label="Hearing reminders"
                  description="Highlight upcoming hearing dates and reminders."
                  checked={settings.citizenHearingReminders}
                  onChange={set('citizenHearingReminders')}
                />
              ) : null}
            </section>
          ) : null}

          {active === 'privacy' ? (
            <section className="lc-card">
              <div className="lc-card-head">
                <div>
                  <h3>Privacy</h3>
                  <p>Choose what is visible in shared views.</p>
                </div>
              </div>

              <ToggleRow
                id="publicProfile"
                label="Public profile"
                description="Show your name/photo in shared case views (recommended off for citizens)."
                checked={settings.publicProfile}
                onChange={set('publicProfile')}
              />
            </section>
          ) : null}

          {active === 'display' ? (
            <section className="lc-card">
              <div className="lc-card-head">
                <div>
                  <h3>Display</h3>
                  <p>Layout and density preferences.</p>
                </div>
              </div>

              <ToggleRow
                id="compactLayout"
                label="Compact layout"
                description="Tighter spacing for dense lists and tables."
                checked={settings.compactLayout}
                onChange={set('compactLayout')}
              />
            </section>
          ) : null}

          {active === 'data' ? (
            <section className="lc-card">
              <div className="lc-card-head">
                <div>
                  <h3>Data</h3>
                  <p>Control local settings stored in this browser.</p>
                </div>
              </div>

              <div className="lc-setting-row">
                <div className="lc-setting-info">
                  <div className="lc-setting-label">Reset preferences</div>
                  <p className="lc-setting-desc">Restore defaults for all settings.</p>
                </div>
                <button className="lc-btn-ghost" type="button" onClick={onReset}>
                  Reset
                </button>
              </div>
            </section>
          ) : null}

          <section className="lc-card">
            <div className="lc-actions-bar">
              <button className="btn-primary" type="submit">
                Save settings
              </button>
              {message ? (
                <div className="lc-alert success" role="status">
                  {message}
                </div>
              ) : null}
            </div>
          </section>
        </section>
      </form>
    </PageTemplate>
  );
}
