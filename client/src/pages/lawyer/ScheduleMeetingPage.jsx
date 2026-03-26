import { useState } from 'react';
import PageTemplate from '../PageTemplate';
import api from '../../services/api';

export default function ScheduleMeetingPage() {
  const [form, setForm] = useState({ title: '', appointmentDate: '', notes: '' });
  const [message, setMessage] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/appointments', form);
      setMessage('Meeting scheduled successfully.');
      setForm({ title: '', appointmentDate: '', notes: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not schedule meeting.');
    }
  };

  return (
    <PageTemplate title="Schedule Meeting" description="Plan meetings with citizens and case stakeholders.">
      <section className="card">
        <form className="stack-form" onSubmit={onSubmit}>
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Meeting title"
            required
          />
          <input
            type="datetime-local"
            value={form.appointmentDate}
            onChange={(event) => setForm((prev) => ({ ...prev, appointmentDate: event.target.value }))}
            required
          />
          <textarea
            rows={3}
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            placeholder="Meeting notes"
          />
          <button className="btn-primary" type="submit">Schedule</button>
          {message && <p className="info-text">{message}</p>}
        </form>
      </section>
    </PageTemplate>
  );
}
