import { useAuth } from '../hooks/useAuth';

const ROLE_COPY = {
  citizen: {
    access: 'Citizen support access',
    guidance: 'Case tracking and legal assistance',
    navigation: 'Citizen-focused workflow pages',
  },
  lawyer: {
    access: 'Lawyer operations access',
    guidance: 'Client and case progress management',
    navigation: 'Lawyer casework workflow pages',
  },
  judge: {
    access: 'Judicial access control',
    guidance: 'Hearing and judgment management',
    navigation: 'Judge-specific decision workflow',
  },
  police: {
    access: 'Police operations access',
    guidance: 'FIR, investigation and report workflow',
    navigation: 'Police case handling pages',
  },
  admin: {
    access: 'Administrative secure access',
    guidance: 'User governance and analytics',
    navigation: 'Admin management workflow pages',
  },
};

export default function PageTemplate({ title, description, children }) {
  const { user } = useAuth();
  const role = user?.role || 'citizen';
  const copy = ROLE_COPY[role] || ROLE_COPY.citizen;

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="page-container">
      <section className="page-header page-hero card">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="page-hero-meta">
          <span>{copy.access}</span>
          <span>{today}</span>
        </div>
      </section>

      {children}
    </div>
  );
}
