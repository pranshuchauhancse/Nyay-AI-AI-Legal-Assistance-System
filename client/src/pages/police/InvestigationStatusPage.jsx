import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { getCases, updateCase } from '../../services/caseService';

export default function InvestigationStatusPage() {
  const [cases, setCases] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [status, setStatus] = useState('Under Investigation');
  const [policeStatus, setPoliceStatus] = useState('');
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
      await updateCase(selectedId, { status, policeStatus });
      setMessage('Investigation status updated.');
      loadCases();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update investigation status.');
    }
  };

  return (
    <PageTemplate title="Investigation Status" description="Update and track investigation progress for active cases.">
      <section className="page-grid two-col">
        <article className="card">
          <form className="stack-form" onSubmit={onSubmit}>
            <select
              value={selectedId}
              onChange={(event) => {
                const id = event.target.value;
                const found = cases.find((item) => item._id === id);
                setSelectedId(id);
                setStatus(found?.status || 'Under Investigation');
                setPoliceStatus(found?.policeStatus || '');
              }}
              required
            >
              <option value="">Select case</option>
              {cases.map((item) => (
                <option key={item._id} value={item._id}>{item.title}</option>
              ))}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="Under Investigation">Under Investigation</option>
              <option value="In Hearing">In Hearing</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <textarea
              rows={5}
              value={policeStatus}
              onChange={(event) => setPoliceStatus(event.target.value)}
              placeholder="Investigation update"
              required
            />
            <button className="btn-primary" type="submit">Save Update</button>
            {message && <p className="info-text">{message}</p>}
          </form>
        </article>

        <article className="card list-wrap">
          <h3>Investigation Records</h3>
          {cases.map((item) => (
            <article key={item._id} className="list-item">
              <h4>{item.title}</h4>
              <p>{item.policeStatus || 'No investigation note added yet.'}</p>
              <small>Status: {item.status}</small>
            </article>
          ))}
          {!cases.length && <p>No investigation records found.</p>}
        </article>
      </section>
    </PageTemplate>
  );
}
