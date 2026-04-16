import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { getCases, updateCase } from '../../services/caseService';

export default function HearingSchedulePage() {
  const [cases, setCases] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [hearingDate, setHearingDate] = useState('');
  const [message, setMessage] = useState('');

  const loadCases = async () => {
    try {
      const data = await getCases();
      setCases((data || []).filter((item) => item.hearingDate || item.nextHearingDate || item.status !== 'Closed'));
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
      await updateCase(selectedId, { hearingDate });
      setMessage('Hearing date updated successfully.');
      loadCases();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update hearing date.');
    }
  };

  return (
    <PageTemplate title="Hearing Schedule" description="Create and update upcoming hearing schedules.">
      <section className="page-grid two-col">
        <article className="card">
          <h3>Schedule Hearing</h3>
          <form className="stack-form" onSubmit={onSubmit}>
            <select
              value={selectedId}
              onChange={(event) => {
                const id = event.target.value;
                const found = cases.find((item) => item._id === id);
                setSelectedId(id);
                setHearingDate(found?.hearingDate ? found.hearingDate.slice(0, 16) : '');
              }}
              required
            >
              <option value="">Select case</option>
              {cases.map((item) => (
                <option key={item._id} value={item._id}>{item.title}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={hearingDate}
              onChange={(event) => setHearingDate(event.target.value)}
              required
            />
            <button className="btn-primary" type="submit">Save Hearing</button>
            {message && <p className="info-text">{message}</p>}
          </form>
        </article>

        <article className="card list-wrap">
          <h3>Scheduled Hearings</h3>
          {cases
            .filter((item) => item.hearingDate || item.nextHearingDate)
            .map((item) => (
              <article key={item._id} className="list-item">
                <h4>{item.title}</h4>
                <p>Hearing: {new Date(item.hearingDate || item.nextHearingDate).toLocaleString('en-IN')}</p>
                <small>Status: {item.status}</small>
              </article>
            ))}
          {!cases.filter((item) => item.hearingDate || item.nextHearingDate).length && <p>No hearings scheduled.</p>}
        </article>
      </section>
    </PageTemplate>
  );
}
