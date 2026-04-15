import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTemplate from '../PageTemplate';
import { getCases } from '../../services/caseService';
import api from '../../services/api';

export default function PoliceDashboard() {
  const [stats, setStats] = useState({
    newFirs: 0,
    underInvestigation: 0,
    closedCases: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [cases, reportsResponse] = await Promise.all([
          getCases(),
          api.get('/reports'),
        ]);

        const caseList = cases || [];
        const reports = reportsResponse.data || [];

        setStats({
          newFirs: reports.filter((item) => item.type === 'FIR').length,
          underInvestigation: caseList.filter((item) => item.status === 'Under Investigation').length,
          closedCases: caseList.filter((item) => item.status === 'Closed').length,
        });
        setRecentReports(reports.slice(0, 4));
      } catch {
        setStats({ newFirs: 0, underInvestigation: 0, closedCases: 0 });
        setRecentReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <PageTemplate title="Police Dashboard" description="Manage FIRs, investigations, and reports.">
      <section className="stats-row">
        <div className="card stat-card">
          <h3>FIR Reports</h3>
          <p>{stats.newFirs}</p>
        </div>
        <div className="card stat-card">
          <h3>Under Investigation</h3>
          <p>{stats.underInvestigation}</p>
        </div>
        <div className="card stat-card">
          <h3>Closed Cases</h3>
          <p>{stats.closedCases}</p>
        </div>
      </section>

      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Quick Actions</h3>
        <div className="action-row">
          <Link className="btn-secondary link-as-btn" to="/police/fir-complaints">FIR Complaints</Link>
          <Link className="btn-secondary link-as-btn" to="/police/investigation-status">Investigation Status</Link>
          <Link className="btn-secondary link-as-btn" to="/police/upload-reports">Upload Reports</Link>
        </div>
      </section>

      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Recent Reports</h3>
        {loading && <p>Loading dashboard...</p>}
        {!loading && (
          <div className="list-wrap" style={{ gap: '8px' }}>
            {recentReports.map((item) => (
              <div className="list-item" key={item._id}>
                <h4 style={{ margin: 0 }}>{item.title}</h4>
                <p style={{ margin: '4px 0 0' }}>{item.type} | {item.status}</p>
              </div>
            ))}
            {!recentReports.length && <p>No report activity yet.</p>}
          </div>
        )}
      </section>
    </PageTemplate>
  );
}
