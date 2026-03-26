import { useState } from 'react';
import PageTemplate from '../PageTemplate';

export default function SettingsPage() {
  const [message, setMessage] = useState('');

  const onSave = (event) => {
    event.preventDefault();
    setMessage('Settings saved successfully.');
    setTimeout(() => setMessage(''), 2500);
  };

  return (
    <PageTemplate title="Settings" description="Manage app preferences for your account.">
      <section className="card">
        <form className="stack-form" onSubmit={onSave}>
          <label className="toggle-row">
            <input type="checkbox" defaultChecked />
            Enable email notifications
          </label>
          <label className="toggle-row">
            <input type="checkbox" defaultChecked />
            Auto refresh dashboard data
          </label>
          <button className="btn-primary" type="submit">Save Settings</button>
          {message && <p className="info-text">{message}</p>}
        </form>
      </section>
    </PageTemplate>
  );
}
