import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import Clients from './pages/Clients';
import Appointments from './pages/Appointments';
import Login from './pages/Login';
import { useAuth } from './hooks/useAuth';

function ProtectedLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/*"
        element={isAuthenticated ? <ProtectedLayout /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
