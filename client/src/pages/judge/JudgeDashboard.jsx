import { Link } from 'react-router-dom';
import PageTemplate from '../PageTemplate';
import { useState } from 'react';

export default function JudgeDashboard() {
  const [stats] = useState({
    pendingCases: 0,
    hearingsToday: 0,
    caseLoadPercentage: 0
  });
  return (
    <PageTemplate title="Judge Dashboard" description="Review cases, hearings, and judgments.">
      
      {/* Quick Stats */}
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
          <h3>Case Load</h3>
          <p>{stats.caseLoadPercentage}%</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Quick Actions</h3>
        <div className="action-row">
          <Link className="btn-secondary link-as-btn" to="/judge/case-list">Case List</Link>
          <Link className="btn-secondary link-as-btn" to="/judge/hearing-schedule">Hearing Schedule</Link>
          <Link className="btn-secondary link-as-btn" to="/judge/update-judgment">Update Judgment</Link>
        </div>
      </section>

      {/* Today's Hearings */}
      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Today's Hearings</h3>
        <div className="list-wrap" style={{ gap: '8px' }}>
          <div className="list-item">
            <h4 style={{ margin: 0 }}>⏰ 10:00 AM - Case #2024-J01</h4>
            <p style={{ margin: '4px 0 0' }}>Criminal Case - Vs. State | Courtroom 3</p>
          </div>
          <div className="list-item">
            <h4 style={{ margin: 0 }}>⏰ 02:00 PM - Case #2024-J02</h4>
            <p style={{ margin: '4px 0 0' }}>Civil Case - Property Dispute | Courtroom 1</p>
          </div>
          <div className="list-item">
            <h4 style={{ margin: 0 }}>⏰ 04:30 PM - Case #2024-J03</h4>
            <p style={{ margin: '4px 0 0' }}>Appeal Case - Appeals Division | Courtroom 5</p>
          </div>
        </div>
      </section>

    </PageTemplate>
  );
}
