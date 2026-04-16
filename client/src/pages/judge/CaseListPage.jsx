import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { getCases, updateCase } from '../../services/caseService';

export default function CaseListPage() {
  const [cases, setCases] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [status, setStatus] = useState('In Hearing');
  const [hearingDate, setHearingDate] = useState('');
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
      await updateCase(selectedId, {
        status,
        hearingDate: hearingDate || null,
      });
      setMessage('Case details updated successfully.');
      loadCases();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update case details.');
    }
  };

  return (
    <PageTemplate title="Case List" description="View, update status, and schedule hearing details for cases.">
      <section className="page-grid two-col">
        <article className="card">
          <h3>Update Case</h3>
          <form className="stack-form" onSubmit={onSubmit}>
            <select
              value={selectedId}
              onChange={(event) => {
                const id = event.target.value;
                const found = cases.find((item) => item._id === id);
                setSelectedId(id);
                setStatus(found?.status || 'Filed');
                setHearingDate(found?.hearingDate ? found.hearingDate.slice(0, 16) : '');
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
            <input
              type="datetime-local"
              value={hearingDate}
              onChange={(event) => setHearingDate(event.target.value)}
            />
            <button className="btn-primary" type="submit">Save</button>
            {message && <p className="info-text">{message}</p>}
          </form>
        </article>

        <article className="card list-wrap">
          <h3>Case Records</h3>
          {cases.map((item) => (
            <article key={item._id} className="list-item">
              <h4>{item.title}</h4>
              <p>{item.description || 'No description'}</p>
              <small>
                Status: {item.status} | Hearing:{' '}
                {item.hearingDate ? new Date(item.hearingDate).toLocaleString('en-IN') : 'Not scheduled'}
              </small>
            </article>
          ))}
          {!cases.length && <p>No cases found.</p>}
        </article>
      </section>
    </PageTemplate>
  );
}
