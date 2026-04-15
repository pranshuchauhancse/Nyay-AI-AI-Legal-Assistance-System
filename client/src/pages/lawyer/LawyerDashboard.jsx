import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTemplate from '../PageTemplate';
import { getCases } from '../../services/caseService';
import api from '../../services/api';

export default function LawyerDashboard() {
  const [stats, setStats] = useState({
    activeCases: 0,
    clients: 0,
    pendingMeetings: 0,
  });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [cases, clientsResponse, meetingsResponse] = await Promise.all([
          getCases(),
          api.get('/clients'),
          api.get('/appointments'),
        ]);

        const caseList = cases || [];
        const clientList = clientsResponse.data || [];
        const meetingList = meetingsResponse.data || [];

        setStats({
          activeCases: caseList.filter((item) => !['Resolved', 'Closed'].includes(item.status)).length,
          clients: clientList.length,
          pendingMeetings: meetingList.filter((item) => item.status === 'Pending').length,
        });
        setRecentCases(caseList.slice(0, 4));
      } catch {
        setStats({ activeCases: 0, clients: 0, pendingMeetings: 0 });
        setRecentCases([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <PageTemplate title="Lawyer Dashboard" description="Manage assigned cases and client workflows.">
      <section className="stats-row">
        <div className="card stat-card">
          <h3>Active Cases</h3>
          <p>{stats.activeCases}</p>
        </div>
        <div className="card stat-card">
          <h3>Clients</h3>
          <p>{stats.clients}</p>
        </div>
        <div className="card stat-card">
          <h3>Pending Meetings</h3>
          <p>{stats.pendingMeetings}</p>
        </div>
      </section>

      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Quick Actions</h3>
        <div className="action-row">
          <Link className="btn-secondary link-as-btn" to="/lawyer/assigned-cases">Assigned Cases</Link>
          <Link className="btn-secondary link-as-btn" to="/lawyer/client-list">Client List</Link>
          <Link className="btn-secondary link-as-btn" to="/lawyer/update-case">Update Case</Link>
          <Link className="btn-secondary link-as-btn" to="/lawyer/schedule-meeting">Schedule Meeting</Link>
        </div>
      </section>

      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Recent Assigned Cases</h3>
        {loading && <p>Loading dashboard...</p>}
        {!loading && (
          <div className="list-wrap" style={{ gap: '8px' }}>
            {recentCases.map((item) => (
              <div className="list-item" key={item._id}>
                <h4 style={{ margin: 0 }}>{item.title}</h4>
                <p style={{ margin: '4px 0 0' }}>Status: {item.status}</p>
              </div>
            ))}
            {!recentCases.length && <p>No assigned cases found yet.</p>}
          </div>
        )}
      </section>
    </PageTemplate>
  );
}
