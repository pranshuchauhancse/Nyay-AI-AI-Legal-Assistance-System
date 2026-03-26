import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { getCases, updateCase } from '../../services/caseService';

export default function UpdateCasePage() {
  const [cases, setCases] = useState([]);
  const [selectedId, setSelectedId] = useState('');
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

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateCase(selectedId, { status });
      setMessage('Case updated successfully.');
      loadCases();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update case.');
    }
  };

  return (
    <PageTemplate title="Update Case" description="Update progress for your casework.">
      <section className="card">
        <form className="stack-form" onSubmit={onSubmit}>
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} required>
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
          <button className="btn-primary" type="submit">Update Case</button>
          {message && <p className="info-text">{message}</p>}
        </form>
      </section>
    </PageTemplate>
  );
}
