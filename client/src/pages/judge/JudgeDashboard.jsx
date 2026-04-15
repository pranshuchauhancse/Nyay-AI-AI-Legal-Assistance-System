import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTemplate from '../PageTemplate';
import { getCases } from '../../services/caseService';

export default function JudgeDashboard() {
  const [stats, setStats] = useState({
    pendingCases: 0,
    hearingsToday: 0,
    resolvedCases: 0,
  });
  const [upcomingHearings, setUpcomingHearings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const cases = await getCases();
        const caseList = cases || [];
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(todayStart.getDate() + 1);

        const hearingsToday = caseList.filter((item) => {
          const dateValue = item.hearingDate || item.nextHearingDate;
          if (!dateValue) return false;
          const date = new Date(dateValue);
          return date >= todayStart && date < tomorrowStart;
        });

        setStats({
          pendingCases: caseList.filter((item) => !['Resolved', 'Closed'].includes(item.status)).length,
          hearingsToday: hearingsToday.length,
          resolvedCases: caseList.filter((item) => item.status === 'Resolved').length,
        });

        setUpcomingHearings(
          caseList
            .filter((item) => item.hearingDate || item.nextHearingDate)
            .sort((a, b) => new Date(a.hearingDate || a.nextHearingDate) - new Date(b.hearingDate || b.nextHearingDate))
            .slice(0, 4)
        );
      } catch {
        setStats({ pendingCases: 0, hearingsToday: 0, resolvedCases: 0 });
        setUpcomingHearings([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <PageTemplate title="Judge Dashboard" description="Review cases, hearings, and judgments.">
      <section className="stats-row">
        <div className="card stat-card">
          <h3>Pending Cases</h3>
          <p>{stats.pendingCases}</p>
        </div>
        <div className="card stat-card">
          <h3>Hearings Today</h3>
          <p>{stats.hearingsToday}</p>
        </div>
        <div className="card stat-card">
          <h3>Resolved Cases</h3>
          <p>{stats.resolvedCases}</p>
        </div>
      </section>

      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Quick Actions</h3>
        <div className="action-row">
          <Link className="btn-secondary link-as-btn" to="/judge/case-list">Case List</Link>
          <Link className="btn-secondary link-as-btn" to="/judge/hearing-schedule">Hearing Schedule</Link>
          <Link className="btn-secondary link-as-btn" to="/judge/update-judgment">Update Judgment</Link>
        </div>
      </section>

      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Upcoming Hearings</h3>
        {loading && <p>Loading dashboard...</p>}
        {!loading && (
          <div className="list-wrap" style={{ gap: '8px' }}>
            {upcomingHearings.map((item) => (
              <div className="list-item" key={item._id}>
                <h4 style={{ margin: 0 }}>{item.title}</h4>
                <p style={{ margin: '4px 0 0' }}>
                  Hearing: {new Date(item.hearingDate || item.nextHearingDate).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
            {!upcomingHearings.length && <p>No hearings scheduled yet.</p>}
          </div>
        )}
      </section>
    </PageTemplate>
  );
}
