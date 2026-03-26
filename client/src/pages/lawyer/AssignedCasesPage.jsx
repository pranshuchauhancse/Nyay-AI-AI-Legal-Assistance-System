import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { getCases } from '../../services/caseService';

export default function AssignedCasesPage() {
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
    <PageTemplate title="Assigned Cases" description="View cases currently assigned to you.">
      <section className="card list-wrap">
        {cases.map((item) => (
          <article key={item._id} className="list-item">
            <h4>{item.title}</h4>
            <p>{item.description || 'No description'}</p>
            <small>Status: {item.status}</small>
          </article>
        ))}
        {!cases.length && <p>No assigned cases found.</p>}
      </section>
    </PageTemplate>
  );
}
