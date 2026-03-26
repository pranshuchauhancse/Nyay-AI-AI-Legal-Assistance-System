import { Link } from 'react-router-dom';
import PageTemplate from '../PageTemplate';
import { useState } from 'react';

export default function LawyerDashboard() {
  const [stats] = useState({
    activeCases: 0,
    clients: 0,
    pendingMeetings: 0
  });

  return (
    <PageTemplate title="Lawyer Dashboard" description="Manage assigned cases and client workflows.">
      
      {/* Quick Stats */}
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

      {/* Quick Actions */}
      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Quick Actions</h3>
        <div className="action-row">
          <Link className="btn-secondary link-as-btn" to="/lawyer/assigned-cases">Assigned Cases</Link>
          <Link className="btn-secondary link-as-btn" to="/lawyer/client-list">Client List</Link>
          <Link className="btn-secondary link-as-btn" to="/lawyer/update-case">Update Case</Link>
          <Link className="btn-secondary link-as-btn" to="/lawyer/schedule-meeting">Schedule Meeting</Link>
        </div>
      </section>

      {/* Case Overview */}
      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Case Overview</h3>
        <div style={{ display: 'grid', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--role-border)' }}>
            <div>
              <strong>Case #2024-A01</strong> - Client: Rajesh Kumar
            </div>
            <span style={{ background: 'var(--role-accent-light)', color: 'var(--role-accent-text)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
              In Progress
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--role-border)' }}>
            <div>
              <strong>Case #2024-A02</strong> - Client: Priya Singh
            </div>
            <span style={{ background: 'var(--role-accent-light)', color: 'var(--role-accent-text)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
              Awaiting Hearing
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <div>
              <strong>Case #2024-A03</strong> - Client: Arjun Patel
            </div>
            <span style={{ background: '#e0f2fe', color: '#0c2d6b', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
              Documentation
            </span>
          </div>
        </div>
      </section>

    </PageTemplate>
  );
}
