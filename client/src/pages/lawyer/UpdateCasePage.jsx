import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { getCases, updateCase } from '../../services/caseService';

export default function UpdateCasePage() {
  const [cases, setCases] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [status, setStatus] = useState('In Hearing');
  const [description, setDescription] = useState('');
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
      await updateCase(selectedId, { status, description });
      setMessage('Case updated successfully.');
      loadCases();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update case.');
    }
  };

  return (
    <PageTemplate title="Update Case" description="Update status and notes for active casework.">
      <section className="page-grid two-col">
        <article className="card">
          <form className="stack-form" onSubmit={onSubmit}>
            <select
              value={selectedId}
              onChange={(event) => {
                const value = event.target.value;
                const found = cases.find((item) => item._id === value);
                setSelectedId(value);
                setStatus(found?.status || 'Filed');
                setDescription(found?.description || '');
              }}
              required
            >
              <option value="">Select case</option>
              {cases.map((item) => (
                <option key={item._id} value={item._id}>{item.title}</option>
              ))}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="Filed">Filed</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="In Hearing">In Hearing</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <textarea
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Case note/description"
            />
            <button className="btn-primary" type="submit">Update Case</button>
            {message && <p className="info-text">{message}</p>}
          </form>
        </article>

        <article className="card list-wrap">
          <h3>Current Cases</h3>
          {cases.map((item) => (
            <article key={item._id} className="list-item">
              <h4>{item.title}</h4>
              <p>{item.description || 'No description'}</p>
              <small>Status: {item.status}</small>
            </article>
          ))}
          {!cases.length && <p>No cases found.</p>}
        </article>
      </section>
    </PageTemplate>
  );
}
