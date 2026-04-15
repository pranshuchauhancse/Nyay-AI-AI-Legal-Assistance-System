import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import api from '../../services/api';

const initialForm = {
  title: '',
  description: '',
  status: 'Submitted',
};

export default function FIRComplaintsPage() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadReports = async () => {
    try {
      const { data } = await api.get('/reports');
      setReports((data || []).filter((item) => item.type === 'FIR'));
    } catch {
      setReports([]);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/reports/${editingId}`, { ...form, type: 'FIR' });
        setMessage('FIR updated successfully.');
      } else {
        await api.post('/reports', { ...form, type: 'FIR' });
        setMessage('FIR created successfully.');
      }
      setEditingId(null);
      setForm(initialForm);
      loadReports();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save FIR record.');
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      status: item.status || 'Submitted',
    });
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/reports/${id}`);
      setMessage('FIR deleted successfully.');
      if (editingId === id) {
        setEditingId(null);
        setForm(initialForm);
      }
      loadReports();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not delete FIR record.');
    }
  };

  return (
    <PageTemplate title="FIR and Complaints" description="Create, update, and manage FIR complaint records.">
      <section className="page-grid two-col">
        <article className="card">
          <h3>{editingId ? 'Edit FIR' : 'Add FIR'}</h3>
          <form className="stack-form" onSubmit={onSubmit}>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="FIR title"
              required
            />
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Complaint details"
            />
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Reviewed">Reviewed</option>
            </select>
            <div className="action-row">
              <button className="btn-primary" type="submit">{editingId ? 'Update FIR' : 'Create FIR'}</button>
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
          <h3>FIR Records</h3>
          {reports.map((item) => (
            <article key={item._id} className="list-item">
              <h4>{item.title}</h4>
              <p>{item.description || 'No complaint details'}</p>
              <small>Status: {item.status}</small>
              <div className="action-row">
                <button className="btn-secondary" type="button" onClick={() => onEdit(item)}>Edit</button>
                <button className="btn-danger" type="button" onClick={() => onDelete(item._id)}>Delete</button>
              </div>
            </article>
          ))}
          {!reports.length && <p>No FIR records available.</p>}
        </article>
      </section>
    </PageTemplate>
  );
}
