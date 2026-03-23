import { useEffect, useState } from 'react';
import api from '../services/api';
import ChatBot from '../components/ChatBot';

export default function Dashboard() {
  const [stats, setStats] = useState({ cases: 0, clients: 0, openCases: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [casesRes, clientsRes] = await Promise.all([
          api.get('/cases'),
          api.get('/clients'),
        ]);

        const totalCases = casesRes.data.length;
        const openCases = casesRes.data.filter((item) => item.status !== 'Closed').length;

        setStats({
          cases: totalCases,
          clients: clientsRes.data.length,
          openCases,
        });
      } catch (error) {
        setStats({ cases: 0, clients: 0, openCases: 0 });
      }
    };

    loadStats();
  }, []);

  return (
    <div className="page-grid">
      <section className="stats-row">
        <article className="card stat-card">
          <h3>Total Cases</h3>
          <p>{stats.cases}</p>
        </article>
        <article className="card stat-card">
          <h3>Active Cases</h3>
          <p>{stats.openCases}</p>
        </article>
        <article className="card stat-card">
          <h3>Total Clients</h3>
          <p>{stats.clients}</p>
        </article>
      </section>
      <ChatBot />
    </div>
  );
}
