import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { deleteCase, getCases, updateCase } from '../../services/caseService';

export default function AssignedCasesPage() {
  const [cases, setCases] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('In Hearing');
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

  const onSave = async () => {
    if (!editingId) return;

    try {
      await updateCase(editingId, { status });
      setMessage('Case status updated successfully.');
      setEditingId(null);
      loadCases();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update assigned case.');
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteCase(id);
      setMessage('Case deleted successfully.');
      if (editingId === id) {
        setEditingId(null);
      }
      loadCases();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Delete not allowed for this case.');
    }
  };

  return (
    <PageTemplate title="Assigned Cases" description="Review, update, and manage your assigned cases.">
      {editingId && (
        <section className="card" style={{ marginBottom: '12px' }}>
          <h3>Quick Update</h3>
          <div className="action-row">
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="Filed">Filed</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="In Hearing">In Hearing</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <button className="btn-primary" type="button" onClick={onSave}>Save</button>
            <button className="btn-secondary" type="button" onClick={() => setEditingId(null)}>Cancel</button>
          </div>
        </section>
      )}

      <section className="card list-wrap">
        {cases.map((item) => (
          <article key={item._id} className="list-item">
            <h4>{item.title}</h4>
            <p>{item.description || 'No description'}</p>
            <small>Status: {item.status}</small>
            <div className="action-row">
              <button
                className="btn-secondary"
                type="button"
                onClick={() => {
                  setEditingId(item._id);
                  setStatus(item.status || 'Filed');
                }}
              >
                Edit
              </button>
              <button className="btn-danger" type="button" onClick={() => onDelete(item._id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
        {!cases.length && <p>No assigned cases found.</p>}
      </section>

      {message && <p className="info-text">{message}</p>}
    </PageTemplate>
  );
}
