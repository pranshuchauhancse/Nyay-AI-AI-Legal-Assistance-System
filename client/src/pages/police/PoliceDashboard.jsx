import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTemplate from '../PageTemplate';

export default function PoliceDashboard() {
  const [stats] = useState({
    newFirs: 0,
    underInvestigation: 0,
    closedCases: 0
  });

  return (
    <PageTemplate title="Police Dashboard" description="Manage FIRs, investigations, and reports.">
      
      {/* Quick Stats */}
      <section className="stats-row">
        <div className="card stat-card">
          <h3>New FIRs</h3>
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

      {/* Quick Actions */}
      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Quick Actions</h3>
        <div className="action-row">
          <Link className="btn-secondary link-as-btn" to="/police/fir-complaints">FIR Complaints</Link>
          <Link className="btn-secondary link-as-btn" to="/police/investigation-status">Investigation Status</Link>
          <Link className="btn-secondary link-as-btn" to="/police/upload-reports">Upload Reports</Link>
        </div>
      </section>

      {/* Investigation Status */}
      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Active Investigations</h3>
        <div style={{ display: 'grid', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--role-border)' }}>
            <div>
              <strong>FIR #2024-001</strong> - Theft Case
            </div>
            <span style={{ background: '#fee2e2', color: '#7f1d1d', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
              High Priority
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--role-border)' }}>
            <div>
              <strong>FIR #2024-003</strong> - Fraud Investigation
            </div>
            <span style={{ background: 'var(--role-accent-light)', color: 'var(--role-accent-text)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
              In Progress
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
            <div>
              <strong>FIR #2024-005</strong> - Assault Case
            </div>
            <span style={{ background: '#e0f2fe', color: '#0c2d6b', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
              Pending Evidence
            </span>
          </div>
        </div>
      </section>

      {/* Recent Updates */}
      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Recent Updates</h3>
        <div className="list-wrap" style={{ gap: '8px' }}>
          <div className="list-item">
            <h4 style={{ margin: 0 }}>📝 FIR Filed</h4>
            <p style={{ margin: '4px 0 0' }}>New FIR #2024-008 registered - 2 hours ago</p>
          </div>
          <div className="list-item">
            <h4 style={{ margin: 0 }}>📂 Report Submitted</h4>
            <p style={{ margin: '4px 0 0' }}>Investigation report for FIR #2024-002 uploaded - 4 hours ago</p>
          </div>
        </div>
      </section>

    </PageTemplate>
  );
}
