import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import api from '../../services/api';

export default function BookAppointmentPage() {
  const [form, setForm] = useState({ title: '', appointmentDate: '', notes: '' });
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadAppointments = async () => {
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data || []);
    } catch {
      setAppointments([]);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/appointments/${editingId}`, form);
      } else {
        await api.post('/appointments', form);
      }
      setForm({ title: '', appointmentDate: '', notes: '' });
      setEditingId(null);
      setMessage(`Appointment ${editingId ? 'updated' : 'requested'} successfully.`);
      loadAppointments();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not create appointment.');
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
      setMessage('Appointment cancelled successfully.');
      loadAppointments();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not cancel appointment.');
    }
  };

  return (
    <PageTemplate title="Book Appointment" description="Request legal appointments with available authorities.">
      <section className="page-grid two-col">
      <article className="card">
        <form className="stack-form" onSubmit={onSubmit}>
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Appointment title"
            required
          />
          <input
            type="datetime-local"
            value={form.appointmentDate}
            onChange={(event) => setForm((prev) => ({ ...prev, appointmentDate: event.target.value }))}
            required
          />
          <textarea
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            rows={4}
            placeholder="Notes"
          />
          <button className="btn-primary" type="submit">{editingId ? 'Update' : 'Book'}</button>
          {editingId && (
            <button className="btn-secondary" type="button" onClick={() => {
              setEditingId(null);
              setForm({ title: '', appointmentDate: '', notes: '' });
            }}>
              Cancel
            </button>
          )}
          {message && <p className="info-text">{message}</p>}
        </form>
      </article>

      <article className="card list-wrap">
        <h3>My Appointments</h3>
        {appointments.map((item) => (
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
        {!appointments.length && <p>No appointments found.</p>}
      </article>
      </section>
    </PageTemplate>
  );
}
