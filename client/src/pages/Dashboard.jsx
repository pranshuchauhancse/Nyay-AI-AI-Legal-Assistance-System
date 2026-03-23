import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ChatBot from '../components/ChatBot';
import { formatDate } from '../utils/formatDate';

export default function Dashboard() {
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [query, setQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [casesRes, clientsRes] = await Promise.all([
          api.get('/cases'),
          api.get('/clients'),
        ]);
        setCases(casesRes.data || []);
        setClients(clientsRes.data || []);
        setLastUpdated(new Date());
        setError('');
      } catch (error) {
        setCases([]);
        setClients([]);
        setError('Could not load dashboard data right now.');
      }
    };

    loadDashboard();

    const timer = setInterval(loadDashboard, 30000);
    return () => clearInterval(timer);
  }, []);

  const filteredCases = useMemo(() => {
    if (!query.trim()) {
      return cases;
    }

    const term = query.trim().toLowerCase();
    return cases.filter((item) =>
      `${item.title} ${item.description || ''} ${item.client?.name || ''}`
        .toLowerCase()
        .includes(term)
    );
  }, [cases, query]);

  const stats = useMemo(() => {
    const totalCases = cases.length;
    const activeCases = cases.filter((item) => item.status !== 'Closed').length;
    const closedCases = cases.filter((item) => item.status === 'Closed').length;
    const highPriority = cases.filter((item) => item.priority === 'High').length;
    const closureRate = totalCases ? Math.round((closedCases / totalCases) * 100) : 0;

    const now = new Date();
    const next7Days = new Date();
    next7Days.setDate(now.getDate() + 7);
    const upcomingHearings = cases.filter((item) => {
      if (!item.nextHearingDate) {
        return false;
      }
      const hearingDate = new Date(item.nextHearingDate);
      return hearingDate >= now && hearingDate <= next7Days;
    }).length;

    return {
      totalCases,
      activeCases,
      closedCases,
      totalClients: clients.length,
      highPriority,
      closureRate,
      upcomingHearings,
    };
  }, [cases, clients.length]);

  const statusBreakdown = useMemo(() => {
    const total = cases.length || 1;
    const open = cases.filter((item) => item.status === 'Open').length;
    const progress = cases.filter((item) => item.status === 'In Progress').length;
    const closed = cases.filter((item) => item.status === 'Closed').length;

    return [
      { label: 'Open', count: open, pct: Math.round((open / total) * 100) },
      { label: 'In Progress', count: progress, pct: Math.round((progress / total) * 100) },
      { label: 'Closed', count: closed, pct: Math.round((closed / total) * 100) },
    ];
  }, [cases]);

  const priorityBreakdown = useMemo(() => {
    const total = cases.length || 1;
    const low = cases.filter((item) => item.priority === 'Low').length;
    const medium = cases.filter((item) => item.priority === 'Medium').length;
    const high = cases.filter((item) => item.priority === 'High').length;

    return [
      { label: 'Low', count: low, pct: Math.round((low / total) * 100) },
      { label: 'Medium', count: medium, pct: Math.round((medium / total) * 100) },
      { label: 'High', count: high, pct: Math.round((high / total) * 100) },
    ];
  }, [cases]);

  const upcomingCases = useMemo(() => {
    return [...cases]
      .filter((item) => Boolean(item.nextHearingDate))
      .sort((a, b) => new Date(a.nextHearingDate) - new Date(b.nextHearingDate))
      .slice(0, 5);
  }, [cases]);

  const recentCases = useMemo(() => filteredCases.slice(0, 6), [filteredCases]);

  return (
    <div className="page-grid">
      <section className="dashboard-head card">
        <div>
          <h2>Advanced Legal Operations Dashboard</h2>
          <p>Monitor legal workflow health, priorities, hearings, and caseload trends.</p>
        </div>
        <div className="dashboard-tools">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases by title, client, or description"
          />
          <small>Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString('en-IN') : '---'}</small>
        </div>
      </section>

      {error && <p className="error-text">{error}</p>}

      <section className="stats-row">
        <article className="card stat-card">
          <h3>Total Cases</h3>
          <p>{stats.totalCases}</p>
        </article>
        <article className="card stat-card">
          <h3>Active Cases</h3>
          <p>{stats.activeCases}</p>
        </article>
        <article className="card stat-card">
          <h3>Total Clients</h3>
          <p>{stats.totalClients}</p>
        </article>
        <article className="card stat-card">
          <h3>Closure Rate</h3>
          <p>{stats.closureRate}%</p>
        </article>
        <article className="card stat-card">
          <h3>High Priority Cases</h3>
          <p>{stats.highPriority}</p>
        </article>
        <article className="card stat-card">
          <h3>Hearings in 7 Days</h3>
          <p>{stats.upcomingHearings}</p>
        </article>
      </section>

      <section className="page-grid two-col">
        <article className="card">
          <h3>Case Status Distribution</h3>
          <div className="metric-list">
            {statusBreakdown.map((item) => (
              <div key={item.label}>
                <div className="metric-head">
                  <span>{item.label}</span>
                  <strong>{item.count}</strong>
                </div>
                <div className="metric-bar-track">
                  <div className="metric-bar-fill" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h3>Priority Mix</h3>
          <div className="metric-list">
            {priorityBreakdown.map((item) => (
              <div key={item.label}>
                <div className="metric-head">
                  <span>{item.label}</span>
                  <strong>{item.count}</strong>
                </div>
                <div className="metric-bar-track">
                  <div className="metric-bar-fill alt" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="page-grid two-col">
        <article className="card">
          <div className="card-head-inline">
            <h3>Upcoming Hearings</h3>
            <Link className="link-btn inline" to="/cases">Manage Cases</Link>
          </div>
          <div className="list-wrap">
            {upcomingCases.map((item) => (
              <article key={item._id} className="list-item">
                <h4>{item.title}</h4>
                <p>{item.client?.name || 'No client assigned'} | {item.status}</p>
                <small>Hearing: {formatDate(item.nextHearingDate)}</small>
              </article>
            ))}
            {!upcomingCases.length && <p>No upcoming hearings scheduled.</p>}
          </div>
        </article>

        <article className="card">
          <h3>Recent Case Activity</h3>
          <div className="list-wrap">
            {recentCases.map((item) => (
              <article key={item._id} className="list-item">
                <h4>{item.title}</h4>
                <p>{item.description || 'No case description available.'}</p>
                <small>{item.priority} priority | Client: {item.client?.name || 'N/A'}</small>
              </article>
            ))}
            {!recentCases.length && <p>No matching cases found.</p>}
          </div>
        </article>
      </section>

      <section className="page-grid two-col">
        <article className="card">
          <h3>Operations Recommendations</h3>
          <ul className="plain-list">
            <li>Review high-priority matters daily for faster closure.</li>
            <li>Pre-schedule hearings and reminders for the next 7 days.</li>
            <li>Keep client notes updated to improve AI guidance quality.</li>
          </ul>
        </article>
        <article className="card">
          <h3>Quick Actions</h3>
          <div className="action-row">
            <Link className="btn-secondary link-as-btn" to="/cases">Create New Case</Link>
            <Link className="btn-secondary link-as-btn" to="/clients">Add New Client</Link>
            <Link className="btn-secondary link-as-btn" to="/appointments">Plan Appointment</Link>
          </div>
        </article>
      </section>

      <ChatBot />
    </div>
  );
}
