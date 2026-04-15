import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTemplate from '../PageTemplate';
import { getCases } from '../../services/caseService';
import api from '../../services/api';

export default function CitizenDashboard() {
  const [stats, setStats] = useState({
    activeCases: 0,
    appointments: 0,
    upcomingHearings: 0,
  });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [cases, appointmentsResponse] = await Promise.all([
          getCases(),
          api.get('/appointments'),
        ]);

        const appointmentList = appointmentsResponse.data || [];
        const activeCases = (cases || []).filter((item) => !['Resolved', 'Closed'].includes(item.status)).length;
        const upcomingHearings = (cases || []).filter((item) => item.hearingDate || item.nextHearingDate).length;

        setStats({
          activeCases,
          appointments: appointmentList.length,
          upcomingHearings,
        });
        setRecentCases((cases || []).slice(0, 3));
      } catch {
        setStats({ activeCases: 0, appointments: 0, upcomingHearings: 0 });
        setRecentCases([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <PageTemplate
      title="Citizen Dashboard"
      description="Track your cases, appointments, and legal support in one place."
    >
      <section className="stats-row">
        <div className="card stat-card">
          <h3>Active Cases</h3>
          <p>{stats.activeCases}</p>
        </div>
        <div className="card stat-card">
          <h3>Appointments</h3>
          <p>{stats.appointments}</p>
        </div>
        <div className="card stat-card">
          <h3>Upcoming Hearings</h3>
          <p>{stats.upcomingHearings}</p>
        </div>
      </section>

      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Quick Actions</h3>
        <div className="action-row">
          <Link className="btn-secondary link-as-btn" to="/citizen/my-cases">My Cases</Link>
          <Link className="btn-secondary link-as-btn" to="/citizen/case-status">Case Status</Link>
          <Link className="btn-secondary link-as-btn" to="/citizen/book-appointment">Book Appointment</Link>
          <Link className="btn-secondary link-as-btn" to="/chatbot">AI Chatbot</Link>
        </div>
      </section>

      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Recent Cases</h3>
        {loading && <p>Loading dashboard...</p>}
        {!loading && (
          <div className="list-wrap" style={{ gap: '8px' }}>
            {recentCases.map((item) => (
              <div className="list-item" key={item._id}>
                <h4 style={{ margin: 0 }}>{item.title}</h4>
                <p style={{ margin: '4px 0 0' }}>Status: {item.status}</p>
              </div>
            ))}
            {!recentCases.length && <p>No recent case activity yet.</p>}
          </div>
        )}
      </section>
    </PageTemplate>
  );
}
