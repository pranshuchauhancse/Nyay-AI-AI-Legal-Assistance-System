import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { getCases, updateCase } from '../../services/caseService';

export default function UpdateJudgmentPage() {
  const [cases, setCases] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [judgment, setJudgment] = useState('');
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
      await updateCase(selectedId, { judgment, status: 'Resolved' });
      setMessage('Judgment updated successfully.');
      setJudgment('');
      load();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update judgment.');
    }
  };

  return (
    <PageTemplate title="Update Judgment" description="Publish and update case judgments.">
      <section className="card">
        <form className="stack-form" onSubmit={onSubmit}>
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} required>
            <option value="">Select case</option>
            {cases.map((item) => (
              <option key={item._id} value={item._id}>{item.title}</option>
            ))}
          </select>
          <textarea
            rows={5}
            value={judgment}
            onChange={(event) => setJudgment(event.target.value)}
            placeholder="Write judgment"
            required
          />
          <button className="btn-primary" type="submit">Update Judgment</button>
          {message && <p className="info-text">{message}</p>}
        </form>
      </section>
    </PageTemplate>
  );
}
