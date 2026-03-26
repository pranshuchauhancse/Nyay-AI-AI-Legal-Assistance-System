import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { getCases, updateCase } from '../../services/caseService';

export default function InvestigationStatusPage() {
  const [cases, setCases] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [policeStatus, setPoliceStatus] = useState('Under Investigation');
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
      await updateCase(selectedId, { policeStatus, status: 'Under Investigation' });
      setMessage('Investigation status updated.');
      load();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update investigation status.');
    }
  };

  return (
    <PageTemplate title="Investigation Status" description="Update investigation progress for active cases.">
      <section className="card">
        <form className="stack-form" onSubmit={onSubmit}>
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} required>
            <option value="">Select case</option>
            {cases.map((item) => (
              <option key={item._id} value={item._id}>{item.title}</option>
            ))}
          </select>
          <textarea
            rows={4}
            value={policeStatus}
            onChange={(event) => setPoliceStatus(event.target.value)}
            placeholder="Investigation update"
            required
          />
          <button className="btn-primary" type="submit">Update Status</button>
          {message && <p className="info-text">{message}</p>}
        </form>
      </section>
    </PageTemplate>
  );
}
