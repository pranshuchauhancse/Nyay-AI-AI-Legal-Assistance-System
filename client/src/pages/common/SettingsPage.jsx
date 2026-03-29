import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTemplate from '../PageTemplate';

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
  const [active, setActive] = useState('general');
  const [settings, setSettings] = useState(() => DEFAULT_SETTINGS);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const nav = useMemo(
    () => [
      { id: 'general', label: 'General' },
      { id: 'notifications', label: 'Notifications' },
      { id: 'privacy', label: 'Privacy' },
      { id: 'display', label: 'Display' },
    ],
    []
  );

  const onSave = (event) => {
    event.preventDefault();
    saveSettings(settings);
    setMessage('Settings saved.');
    setTimeout(() => setMessage(''), 2000);
  };

  const set = (key) => (value) => setSettings((prev) => ({ ...prev, [key]: value }));

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
