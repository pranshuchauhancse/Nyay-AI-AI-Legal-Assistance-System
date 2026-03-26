import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getRoleLinks } from '../utils/helpers';

export default function Sidebar() {
  const { user } = useAuth();
  const links = getRoleLinks(user?.role);

  return (
    <aside className="sidebar">
      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
