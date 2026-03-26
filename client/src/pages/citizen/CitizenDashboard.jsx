import { Link } from 'react-router-dom';
import PageTemplate from '../PageTemplate';
import { useState } from 'react';

export default function CitizenDashboard() {
  const [stats] = useState({
    activeCases: 0,
    nextAppointmentDays: 0,
    documents: 0
  });

  return (
    <PageTemplate
      title="Citizen Dashboard"
      description="Track your cases, appointments, and legal support in one place."
    >
      {/* Quick Stats */}
      <section className="stats-row">
        <div className="card stat-card">
          <h3>Active Cases</h3>
          <p>{stats.activeCases}</p>
        </div>
        <div className="card stat-card">
          <h3>Appointments</h3>
          <p>{stats.nextAppointmentDays}</p>
        </div>
        <div className="card stat-card">
          <h3>Documents</h3>
          <p>{stats.documents}</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Quick Actions</h3>
        <div className="action-row">
          <Link className="btn-secondary link-as-btn" to="/citizen/my-cases">My Cases</Link>
          <Link className="btn-secondary link-as-btn" to="/citizen/case-status">Case Status</Link>
          <Link className="btn-secondary link-as-btn" to="/citizen/book-appointment">Book Appointment</Link>
          <Link className="btn-secondary link-as-btn" to="/chatbot">AI Chatbot</Link>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="card">
        <h3 style={{ margin: '0 0 14px', fontWeight: 800 }}>Recent Activity</h3>
        <div className="list-wrap" style={{ gap: '8px' }}>
          <div className="list-item">
            <h4 style={{ margin: 0 }}>📋 Case Updated</h4>
            <p style={{ margin: '4px 0 0' }}>Case #2024-001 status changed to "In Progress" - 2 hours ago</p>
          </div>
          <div className="list-item">
            <h4 style={{ margin: 0 }}>📅 Appointment Scheduled</h4>
            <p style={{ margin: '4px 0 0' }}>Meeting with lawyer on March 28 at 2:00 PM - 5 days away</p>
          </div>
          <div className="list-item">
            <h4 style={{ margin: 0 }}>✅ Document Uploaded</h4>
            <p style={{ margin: '4px 0 0' }}>Evidence.pdf submitted successfully - 1 day ago</p>
          </div>
        </div>
      </section>

    </PageTemplate>
  );
}
