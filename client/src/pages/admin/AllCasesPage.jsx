import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { deleteCase, getCases, updateCase } from '../../services/caseService';

export default function AllCasesPage() {
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [status, setStatus] = useState('Filed');
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

  const onUpdateStatus = async (event) => {
    event.preventDefault();
    try {
      await updateCase(selectedCaseId, { status });
      setMessage('Case updated successfully.');
      loadCases();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update case.');
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteCase(id);
      setMessage('Case deleted successfully.');
      loadCases();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not delete case.');
    }
  };

  return (
    <PageTemplate title="All Cases" description="View all cases across the system.">
      <section className="page-grid two-col">
        <article className="card">
          <h3>Quick Case Update</h3>
          <form className="stack-form" onSubmit={onUpdateStatus}>
            <select value={selectedCaseId} onChange={(e) => setSelectedCaseId(e.target.value)} required>
              <option value="">Select case</option>
              {cases.map((item) => (
                <option key={item._id} value={item._id}>{item.title}</option>
              ))}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Filed">Filed</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="In Hearing">In Hearing</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <button className="btn-primary" type="submit">Update Status</button>
            {message && <p className="info-text">{message}</p>}
          </form>
        </article>

        <article className="card list-wrap">
          <h3>Case Records</h3>
          {cases.map((item) => (
            <article key={item._id} className="list-item">
              <h4>{item.title}</h4>
              <p>{item.description || 'No description'}</p>
              <small>Status: {item.status}</small>
              <div className="action-row">
                <button className="btn-secondary" type="button" onClick={() => {
                  setSelectedCaseId(item._id);
                  setStatus(item.status || 'Filed');
                }}>
                  Edit
                </button>
                <button className="btn-danger" type="button" onClick={() => onDelete(item._id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
          {!cases.length && <p>No cases found.</p>}
        </article>
      </section>
    </PageTemplate>
  );
}
