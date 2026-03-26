import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { getCases } from '../../services/caseService';

export default function MyCasesPage() {
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
    <PageTemplate title="My Cases" description="View all your filed and linked legal cases.">
      <section className="card list-wrap">
        {cases.map((item) => (
          <article key={item._id} className="list-item">
            <h4>{item.title}</h4>
            <p>{item.description || 'No description available.'}</p>
            <small>Status: {item.status}</small>
          </article>
        ))}
        {!cases.length && <p>No cases available.</p>}
      </section>
    </PageTemplate>
  );
}
