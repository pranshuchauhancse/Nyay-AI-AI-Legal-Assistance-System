import { useEffect, useState } from 'react';

const SETTINGS_KEY = 'nyay_settings';

const defaultSettings = {
  autoRefreshDashboard: true,
  compactTables: false,
  reminderEmails: true,
  emailNotifications: true,
  aiResponseStyle: 'balanced',
  dashboardRefreshSeconds: 30,
  theme: 'light',
};

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      setSettings({ ...defaultSettings, ...JSON.parse(raw) });
    }
  }, []);

  const onSave = (event) => {
    event.preventDefault();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSavedMessage(' Settings saved successfully');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const SettingToggle = ({ label, icon, description, checked, onChange }) => (
    <div className="setting-item">
      <div className="setting-info">
        <label className="setting-label">
          <span>{icon} {label}</span>
        </label>
        {description && <p className="setting-description">{description}</p>}
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <span className="toggle-slider"></span>
      </label>
    </div>
  );

  const SettingSelect = ({ label, icon, description, value, onChange, options }) => (
    <div className="setting-item">
      <div className="setting-info">
        <label className="setting-label">
          <span>{icon} {label}</span>
        </label>
        {description && <p className="setting-description">{description}</p>}
      </div>
      <select value={value} onChange={onChange} className="setting-select">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  const SettingInput = ({ label, icon, description, value, onChange, min, max, unit }) => (
    <div className="setting-item">
      <div className="setting-info">
        <label className="setting-label">
          <span>{icon} {label}</span>
        </label>
        {description && <p className="setting-description">{description}</p>}
      </div>
      <div className="setting-input-group">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className="setting-input"
        />
        <span className="input-unit">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2> Settings & Preferences</h2>
        <p>Customize your Nyay-AI experience</p>
      </div>

      <form onSubmit={onSave}>
        {/* Dashboard Settings */}
        <section className="settings-section">
          <div className="section-header">
            <h3> Dashboard</h3>
            <p>Configure dashboard behavior and display options</p>
          </div>

          <SettingToggle
            icon=""
            label="Auto Refresh Data"
            description="Automatically refresh dashboard data at regular intervals"
            checked={settings.autoRefreshDashboard}
            onChange={(e) => setSettings((prev) => ({ ...prev, autoRefreshDashboard: e.target.checked }))}
          />

          <SettingInput
            icon="⏱"
            label="Refresh Interval"
            description="How often to refresh data (in seconds)"
            value={settings.dashboardRefreshSeconds}
            onChange={(e) => setSettings((prev) => ({
              ...prev,
              dashboardRefreshSeconds: Number(e.target.value) || 30,
            }))}
            min="10"
            max="300"
            unit="sec"
          />

          <SettingToggle
            icon=""
            label="Compact Layout"
            description="Use condensed table and card layouts"
            checked={settings.compactTables}
            onChange={(e) => setSettings((prev) => ({ ...prev, compactTables: e.target.checked }))}
          />
        </section>

        {/* AI Settings */}
        <section className="settings-section">
          <div className="section-header">
            <h3> AI Assistant</h3>
            <p>Configure AI legal guidance preferences</p>
          </div>

          <SettingSelect
            icon=""
            label="Response Style"
            description="Tone and complexity of AI-generated legal guidance"
            value={settings.aiResponseStyle}
            onChange={(e) => setSettings((prev) => ({ ...prev, aiResponseStyle: e.target.value }))}
            options={[
              { value: 'balanced', label: ' Balanced' },
              { value: 'formal', label: ' Formal' },
              { value: 'simple', label: ' Simple Language' },
              { value: 'detailed', label: ' Detailed Legal Notes' },
            ]}
          />
        </section>

        {/* Notifications */}
        <section className="settings-section">
          <div className="section-header">
            <h3> Notifications</h3>
            <p>Control how and when you receive notifications</p>
          </div>

          <SettingToggle
            icon=""
            label="Email Notifications"
            description="Receive updates about cases and appointments via email"
            checked={settings.reminderEmails}
            onChange={(e) => setSettings((prev) => ({ ...prev, reminderEmails: e.target.checked }))}
          />

          <SettingToggle
            icon="⏰"
            label="Event Reminders"
            description="Get reminded about upcoming appointments and hearings"
            checked={settings.emailNotifications}
            onChange={(e) => setSettings((prev) => ({ ...prev, emailNotifications: e.target.checked }))}
          />
        </section>

        {/* System */}
        <section className="settings-section">
          <div className="section-header">
            <h3> Appearance</h3>
            <p>Customize how Nyay-AI looks</p>
          </div>

          <SettingSelect
            icon=""
            label="Theme"
            description="Choose your preferred color theme"
            value={settings.theme}
            onChange={(e) => setSettings((prev) => ({ ...prev, theme: e.target.value }))}
            options={[
              { value: 'light', label: ' Light' },
              { value: 'dark', label: ' Dark' },
              { value: 'auto', label: ' Auto (System)' },
            ]}
          />
        </section>

        <div className="settings-actions">
          <button type="submit" className="btn-primary">
             Save All Settings
          </button>
          {savedMessage && (
            <p className="success-message">{savedMessage}</p>
          )}
        </div>
      </form>
    </div>
  );
}
