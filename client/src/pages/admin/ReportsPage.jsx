import { useEffect, useMemo, useState } from 'react';
import PageTemplate from '../PageTemplate';
import api from '../../services/api';

const initialForm = {
  title: '',
  description: '',
  type: 'Investigation',
  status: 'Submitted',
};

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadReports = async () => {
    try {
      const { data } = await api.get('/reports');
      setReports(data || []);
    } catch {
      setReports([]);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const analytics = useMemo(() => {
    const total = reports.length;
    const firCount = reports.filter((item) => item.type === 'FIR').length;
    const submitted = reports.filter((item) => item.status === 'Submitted').length;
    return { total, firCount, submitted };
  }, [reports]);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await api.put(`/reports/${editingId}`, form);
        setMessage('Report updated successfully.');
      } else {
        await api.post('/reports', form);
        setMessage('Report created successfully.');
      }
      setForm(initialForm);
      setEditingId(null);
      loadReports();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save report.');
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      type: item.type || 'Investigation',
      status: item.status || 'Submitted',
    });
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/reports/${id}`);
      setMessage('Report deleted successfully.');
      if (editingId === id) {
        setEditingId(null);
        setForm(initialForm);
      }
      loadReports();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not delete report.');
    }
  };

  return (
    <PageTemplate title="Reports and Analytics" description="Review reports, analytics, and manage report records.">
      <section className="stats-row">
        <article className="card stat-card"><h3>Total Reports</h3><p>{analytics.total}</p></article>
        <article className="card stat-card"><h3>FIR Reports</h3><p>{analytics.firCount}</p></article>
        <article className="card stat-card"><h3>Submitted</h3><p>{analytics.submitted}</p></article>
      </section>

      <section className="page-grid two-col">
        <article className="card">
          <h3>{editingId ? 'Edit Report' : 'Create Report'}</h3>
          <form className="stack-form" onSubmit={onSubmit}>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Report title"
              required
            />
            <select
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
            >
              <option value="FIR">FIR</option>
              <option value="Investigation">Investigation</option>
              <option value="System">System</option>
            </select>
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Reviewed">Reviewed</option>
            </select>
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Description"
            />
            <div className="action-row">
              <button className="btn-primary" type="submit">{editingId ? 'Update' : 'Create'}</button>
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
          <h3>Report Records</h3>
          {reports.map((item) => (
            <article key={item._id} className="list-item">
              <h4>{item.title}</h4>
              <p>{item.description || 'No description'}</p>
              <small>Type: {item.type} | Status: {item.status}</small>
              <div className="action-row">
                <button className="btn-secondary" type="button" onClick={() => onEdit(item)}>Edit</button>
                <button className="btn-danger" type="button" onClick={() => onDelete(item._id)}>Delete</button>
              </div>
            </article>
          ))}
          {!reports.length && <p>No reports available.</p>}
        </article>
      </section>
    </PageTemplate>
  );
}
