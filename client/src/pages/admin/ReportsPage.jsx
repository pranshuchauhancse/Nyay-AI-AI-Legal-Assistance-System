import { useEffect, useMemo, useState } from 'react';
import PageTemplate from '../PageTemplate';
import api from '../../services/api';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/reports');
        setReports(data || []);
      } catch {
        setReports([]);
      }
    };

    load();
  }, []);

  const analytics = useMemo(() => {
    const total = reports.length;
    const firCount = reports.filter((item) => item.type === 'FIR').length;
    const submitted = reports.filter((item) => item.status === 'Submitted').length;
    return { total, firCount, submitted };
  }, [reports]);

  return (
    <PageTemplate title="Reports and Analytics" description="Review reports and system-level metrics.">
      <section className="stats-row">
        <article className="card stat-card"><h3>Total Reports</h3><p>{analytics.total}</p></article>
        <article className="card stat-card"><h3>FIR Reports</h3><p>{analytics.firCount}</p></article>
        <article className="card stat-card"><h3>Submitted</h3><p>{analytics.submitted}</p></article>
      </section>

      <section className="card list-wrap">
        {reports.map((item) => (
          <article key={item._id} className="list-item">
            <h4>{item.title}</h4>
            <p>{item.description || 'No description'}</p>
            <small>Type: {item.type} | Status: {item.status}</small>
          </article>
        ))}
        {!reports.length && <p>No reports available.</p>}
      </section>
    </PageTemplate>
  );
}
