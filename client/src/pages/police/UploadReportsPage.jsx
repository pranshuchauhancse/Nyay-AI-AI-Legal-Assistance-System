import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import api from '../../services/api';

export default function UploadReportsPage() {
  const [form, setForm] = useState({ title: '', description: '', type: 'Investigation', status: 'Submitted' });
  const [reports, setReports] = useState([]);
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

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/reports/${editingId}`, form);
        setMessage('Report updated successfully.');
      } else {
        await api.post('/reports', form);
        setMessage('Report uploaded successfully.');
      }
      setForm({ title: '', description: '', type: 'Investigation', status: 'Submitted' });
      setEditingId(null);
      loadReports();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not upload report.');
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
      loadReports();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Delete not allowed for this report.');
    }
  };

  return (
    <PageTemplate title="Upload Reports" description="Submit FIR and investigation reports.">
      <section className="page-grid two-col">
      <article className="card">
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
          </select>
          <textarea
            rows={4}
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Report details"
          />
          <button className="btn-primary" type="submit">{editingId ? 'Update' : 'Upload'}</button>
          {editingId && (
            <button className="btn-secondary" type="button" onClick={() => {
              setEditingId(null);
              setForm({ title: '', description: '', type: 'Investigation', status: 'Submitted' });
            }}>
              Cancel
            </button>
          )}
          {message && <p className="info-text">{message}</p>}
        </form>
      </article>

      <article className="card list-wrap">
        <h3>Uploaded Reports</h3>
        {reports.map((item) => (
          <article key={item._id} className="list-item">
            <h4>{item.title}</h4>
            <p>{item.description || 'No description'}</p>
            <small>{item.type} | {item.status}</small>
            <div className="action-row">
              <button className="btn-secondary" type="button" onClick={() => onEdit(item)}>Edit</button>
              <button className="btn-danger" type="button" onClick={() => onDelete(item._id)}>Delete</button>
            </div>
          </article>
        ))}
        {!reports.length && <p>No reports uploaded yet.</p>}
      </article>
      </section>
    </PageTemplate>
  );
}
