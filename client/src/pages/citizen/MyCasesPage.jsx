import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { createCase, deleteCase, getCases, updateCase } from '../../services/caseService';

const initialForm = {
  title: '',
  description: '',
  status: 'Filed',
};

export default function MyCasesPage() {
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadCases = async () => {
    try {
      const data = await getCases();
      setCases(data || []);
    } catch {
      setCases([]);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await updateCase(editingId, form);
        setMessage('Case updated successfully.');
      } else {
        await createCase(form);
        setMessage('Case created successfully.');
      }

      setForm(initialForm);
      setEditingId(null);
      loadCases();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save case.');
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      status: item.status || 'Filed',
    });
  };

  const onDelete = async (id) => {
    try {
      await deleteCase(id);
      setMessage('Case deleted successfully.');
      if (editingId === id) {
        setEditingId(null);
        setForm(initialForm);
      }
      loadCases();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not delete case.');
    }
  };

  return (
    <PageTemplate title="My Cases" description="Create, update, and track your legal cases.">
      <section className="page-grid two-col">
        <article className="card">
          <h3>{editingId ? 'Edit Case' : 'File New Case'}</h3>
          <form className="stack-form" onSubmit={onSubmit}>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Case title"
              required
            />
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Case description"
            />
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="Filed">Filed</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="In Hearing">In Hearing</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <div className="action-row">
              <button className="btn-primary" type="submit">{editingId ? 'Update Case' : 'Create Case'}</button>
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
          </form>
          {message && <p className="info-text">{message}</p>}
        </article>

        <article className="card list-wrap">
          <h3>My Case Records</h3>
          {cases.map((item) => (
            <article key={item._id} className="list-item">
              <h4>{item.title}</h4>
              <p>{item.description || 'No description available.'}</p>
              <small>Status: {item.status}</small>
              <div className="action-row">
                <button className="btn-secondary" type="button" onClick={() => onEdit(item)}>Edit</button>
                <button className="btn-danger" type="button" onClick={() => onDelete(item._id)}>Delete</button>
              </div>
            </article>
          ))}
          {!cases.length && <p>No cases available.</p>}
        </article>
      </section>
    </PageTemplate>
  );
}
