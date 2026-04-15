import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import api from '../../services/api';

const initialForm = {
  title: '',
  appointmentDate: '',
  notes: '',
};

export default function ScheduleMeetingPage() {
  const [form, setForm] = useState(initialForm);
  const [meetings, setMeetings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadMeetings = async () => {
    try {
      const { data } = await api.get('/appointments');
      setMeetings(data || []);
    } catch {
      setMeetings([]);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/appointments/${editingId}`, form);
        setMessage('Meeting updated successfully.');
      } else {
        await api.post('/appointments', form);
        setMessage('Meeting scheduled successfully.');
      }
      setForm(initialForm);
      setEditingId(null);
      loadMeetings();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save meeting.');
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      appointmentDate: item.appointmentDate ? item.appointmentDate.slice(0, 16) : '',
      notes: item.notes || '',
    });
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
      setMessage('Meeting deleted successfully.');
      if (editingId === id) {
        setEditingId(null);
        setForm(initialForm);
      }
      loadMeetings();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not delete meeting.');
    }
  };

  return (
    <PageTemplate title="Schedule Meeting" description="Plan, edit, and track meetings with citizens and stakeholders.">
      <section className="page-grid two-col">
        <article className="card">
          <h3>{editingId ? 'Edit Meeting' : 'Schedule Meeting'}</h3>
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
            <div className="action-row">
              <button className="btn-primary" type="submit">{editingId ? 'Update' : 'Schedule'}</button>
              {editingId && (
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
            {message && <p className="info-text">{message}</p>}
          </form>
        </article>

        <article className="card list-wrap">
          <h3>Scheduled Meetings</h3>
          {meetings.map((item) => (
            <article key={item._id} className="list-item">
              <h4>{item.title}</h4>
              <p>{item.notes || 'No notes'}</p>
              <small>{new Date(item.appointmentDate).toLocaleString('en-IN')} | {item.status}</small>
              <div className="action-row">
                <button className="btn-secondary" type="button" onClick={() => onEdit(item)}>Edit</button>
                <button className="btn-danger" type="button" onClick={() => onDelete(item._id)}>Delete</button>
              </div>
            </article>
          ))}
          {!meetings.length && <p>No meetings found.</p>}
        </article>
      </section>
    </PageTemplate>
  );
}
