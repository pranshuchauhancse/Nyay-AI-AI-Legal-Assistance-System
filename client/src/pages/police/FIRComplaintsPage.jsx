import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import api from '../../services/api';

export default function FIRComplaintsPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/reports');
        setReports((data || []).filter((item) => item.type === 'FIR'));
      } catch {
        setReports([]);
      }
    };

    load();
  }, []);

  return (
    <PageTemplate title="FIR and Complaints" description="View FIR records and complaint details.">
      <section className="card list-wrap">
        {reports.map((item) => (
          <article key={item._id} className="list-item">
            <h4>{item.title}</h4>
            <p>{item.description || 'No complaint details'}</p>
            <small>Status: {item.status}</small>
          </article>
        ))}
        {!reports.length && <p>No FIR records available.</p>}
      </section>
    </PageTemplate>
  );
}
