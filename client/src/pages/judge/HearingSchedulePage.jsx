import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { getCases } from '../../services/caseService';

export default function HearingSchedulePage() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCases();
        setCases((data || []).filter((item) => item.hearingDate || item.nextHearingDate));
      } catch {
        setCases([]);
      }
    };

    load();
  }, []);

  return (
    <PageTemplate title="Hearing Schedule" description="Manage upcoming hearing dates.">
      <section className="card list-wrap">
        {cases.map((item) => (
          <article key={item._id} className="list-item">
            <h4>{item.title}</h4>
            <p>Hearing: {new Date(item.hearingDate || item.nextHearingDate).toLocaleDateString('en-IN')}</p>
            <small>Status: {item.status}</small>
          </article>
        ))}
        {!cases.length && <p>No hearings scheduled.</p>}
      </section>
    </PageTemplate>
  );
}
