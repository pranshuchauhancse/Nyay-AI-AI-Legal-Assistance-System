import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { getCases, updateCase } from '../../services/caseService';

export default function UpdateJudgmentPage() {
  const [cases, setCases] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [judgment, setJudgment] = useState('');
  const [status, setStatus] = useState('Resolved');
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const data = await getCases();
      setCases(data || []);
    } catch {
      setCases([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateCase(selectedId, { judgment, status });
      setMessage('Judgment updated successfully.');
      load();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update judgment.');
    }
  };

  return (
    <PageTemplate title="Update Judgment" description="Create and update final judgments on cases.">
      <section className="page-grid two-col">
        <article className="card">
          <form className="stack-form" onSubmit={onSubmit}>
            <select
              value={selectedId}
              onChange={(event) => {
                const id = event.target.value;
                const found = cases.find((item) => item._id === id);
                setSelectedId(id);
                setJudgment(found?.judgment || '');
                setStatus(found?.status || 'Resolved');
              }}
              required
            >
              <option value="">Select case</option>
              {cases.map((item) => (
                <option key={item._id} value={item._id}>{item.title}</option>
              ))}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="In Hearing">In Hearing</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <textarea
              rows={6}
              value={judgment}
              onChange={(event) => setJudgment(event.target.value)}
              placeholder="Write judgment"
              required
            />
            <button className="btn-primary" type="submit">Save Judgment</button>
            {message && <p className="info-text">{message}</p>}
          </form>
        </article>

        <article className="card list-wrap">
          <h3>Judgment Records</h3>
          {cases
            .filter((item) => item.judgment)
            .map((item) => (
              <article key={item._id} className="list-item">
                <h4>{item.title}</h4>
                <p>{item.judgment}</p>
                <small>Status: {item.status}</small>
              </article>
            ))}
          {!cases.filter((item) => item.judgment).length && <p>No judgments added yet.</p>}
        </article>
      </section>
    </PageTemplate>
  );
}
