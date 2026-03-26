import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { getCases } from '../../services/caseService';

export default function CaseStatusPage() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCases();
        setCases(data || []);
      } catch {
        setCases([]);
      }
    };
    load();
  }, []);

  return (
    <PageTemplate title="Case Status" description="Check current progress of your cases.">
      <section className="card list-wrap">
        {cases.map((item) => (
          <article key={item._id} className="list-item">
            <h4>{item.title}</h4>
            <p>Status: {item.status}</p>
            <small>Hearing: {item.hearingDate ? new Date(item.hearingDate).toLocaleDateString('en-IN') : 'Pending'}</small>
          </article>
        ))}
        {!cases.length && <p>No status data available.</p>}
      </section>
    </PageTemplate>
  );
}
