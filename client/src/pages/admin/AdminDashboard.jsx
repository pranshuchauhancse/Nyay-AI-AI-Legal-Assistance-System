import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTemplate from '../PageTemplate';
import { getUsers } from '../../services/userService';
import { getCases } from '../../services/caseService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    roleDistribution: [],
    userTrend: [],
    caseStats: [],
    activityRate: 0
  });
  const [loading, setLoading] = useState(true);

  const maxRoleValue = Math.max(...stats.roleDistribution.map((item) => item.value), 1);
  const maxCaseValue = Math.max(...stats.caseStats.map((item) => item.value), 1);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, cases] = await Promise.all([getUsers(), getCases()]);
        
        // Calculate role distribution
        const roleCount = {
          admin: 0,
          lawyer: 0,
          judge: 0,
          police: 0,
          citizen: 0
        };
        
        users.forEach(u => {
          if (roleCount[u.role] !== undefined) {
            roleCount[u.role]++;
          }
        });

        const roleData = Object.entries(roleCount).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          fill: {
            admin: '#0f172a',
            lawyer: '#92400e',
            judge: '#7c3aed',
            police: '#1e40af',
            citizen: '#10b981'
          }[name]
        }));

        // Keep trend deterministic (no fake/random spikes)
        const trend = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          trend.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            users: 0
          });
        }

        const caseList = cases || [];
        const caseStats = [
          {
            name: 'Open',
            value: caseList.filter((item) => ['Filed', 'Under Investigation'].includes(item.status)).length,
          },
          {
            name: 'In Progress',
            value: caseList.filter((item) => item.status === 'In Hearing').length,
          },
          {
            name: 'Closed',
            value: caseList.filter((item) => ['Resolved', 'Closed'].includes(item.status)).length,
          },
        ];

        setStats({
          totalUsers: users.length,
          roleDistribution: roleData,
          userTrend: trend,
          caseStats,
          activityRate: 0
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <PageTemplate title="Admin Dashboard" description="Manage users, roles, cases, reports, and analytics.">
      <div className="card"><p>Loading dashboard...</p></div>
    </PageTemplate>;
  }

  return (
    <PageTemplate title="Admin Dashboard" description="Manage users, roles, cases, reports, and analytics.">
      
      {/* Quick Actions */}
      <section className="card">
        <h3 style={{ margin: '0 0 16px', fontWeight: 800 }}>Quick Actions</h3>
        <div className="action-row">
          <Link className="btn-secondary link-as-btn" to="/admin/manage-users">Manage Users</Link>
          <Link className="btn-secondary link-as-btn" to="/admin/manage-roles">Manage Roles</Link>
          <Link className="btn-secondary link-as-btn" to="/admin/all-cases">All Cases</Link>
          <Link className="btn-secondary link-as-btn" to="/admin/reports">Reports</Link>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="stats-row">
        <div className="card stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="card stat-card">
          <h3>Active Cases</h3>
          <p>{stats.caseStats.reduce((sum, c) => sum + c.value, 0)}</p>
        </div>
        <div className="card stat-card">
          <h3>Activity Rate</h3>
          <p>{stats.activityRate}%</p>
        </div>
      </section>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Role Distribution */}
        <section className="card">
          <h3 style={{ margin: '0 0 16px', fontWeight: 800 }}>User Distribution by Role</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {stats.roleDistribution.map((entry) => (
              <div key={entry.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontWeight: 600 }}>
                  <span>{entry.name}</span>
                  <span>{entry.value}</span>
                </div>
                <div style={{ height: '10px', borderRadius: '999px', background: '#eef2f7', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(entry.value / maxRoleValue) * 100}%`,
                      background: entry.fill,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Case Status */}
        <section className="card">
          <h3 style={{ margin: '0 0 16px', fontWeight: 800 }}>Case Status Overview</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {stats.caseStats.map((item) => (
              <div key={item.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontWeight: 600 }}>
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
                <div style={{ height: '10px', borderRadius: '999px', background: '#eef2f7', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(item.value / maxCaseValue) * 100}%`,
                      background: '#1e40af',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* User Trend */}
      <section className="card">
        <h3 style={{ margin: '0 0 16px', fontWeight: 800 }}>User Activity Trend (Last 7 Days)</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', minHeight: '180px' }}>
          {stats.userTrend.map((item) => (
            <div key={item.date} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', marginBottom: '4px', color: '#4b5563' }}>{item.users}</div>
              <div
                style={{
                  height: `${Math.max(item.users * 12, 8)}px`,
                  borderRadius: '8px 8px 0 0',
                  background: 'linear-gradient(180deg, #10b981, #059669)',
                }}
              />
              <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#6b7280' }}>{item.date}</div>
            </div>
          ))}
        </div>
      </section>

    </PageTemplate>
  );
}
