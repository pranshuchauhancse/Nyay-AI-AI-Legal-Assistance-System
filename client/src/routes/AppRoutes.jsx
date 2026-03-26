import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import { getRoleHome } from '../utils/helpers';

import LoginPage from '../pages/common/LoginPage';
import RegisterPage from '../pages/common/RegisterPage';
import ChatbotPage from '../pages/common/ChatbotPage';
import ProfilePage from '../pages/common/ProfilePage';
import SettingsPage from '../pages/common/SettingsPage';

import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import MyCasesPage from '../pages/citizen/MyCasesPage';
import CaseStatusPage from '../pages/citizen/CaseStatusPage';
import BookAppointmentPage from '../pages/citizen/BookAppointmentPage';

import LawyerDashboard from '../pages/lawyer/LawyerDashboard';
import AssignedCasesPage from '../pages/lawyer/AssignedCasesPage';
import ClientListPage from '../pages/lawyer/ClientListPage';
import UpdateCasePage from '../pages/lawyer/UpdateCasePage';
import ScheduleMeetingPage from '../pages/lawyer/ScheduleMeetingPage';

import JudgeDashboard from '../pages/judge/JudgeDashboard';
import CaseListPage from '../pages/judge/CaseListPage';
import HearingSchedulePage from '../pages/judge/HearingSchedulePage';
import UpdateJudgmentPage from '../pages/judge/UpdateJudgmentPage';

import PoliceDashboard from '../pages/police/PoliceDashboard';
import FIRComplaintsPage from '../pages/police/FIRComplaintsPage';
import InvestigationStatusPage from '../pages/police/InvestigationStatusPage';
import UploadReportsPage from '../pages/police/UploadReportsPage';

import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import ManageRolesPage from '../pages/admin/ManageRolesPage';
import AllCasesPage from '../pages/admin/AllCasesPage';
import ReportsPage from '../pages/admin/ReportsPage';

function Layout() {
  const { user } = useAuth();
  const role = user?.role || 'citizen';

  return (
    <div className={`app-shell role-theme role-${role}`}>
      <Navbar />
      <main className="content-area">
        <Routes>
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

            <Route path="/citizen/dashboard" element={<ProtectedRoute allowedRoles={['citizen']}><CitizenDashboard /></ProtectedRoute>} />
            <Route path="/citizen/my-cases" element={<ProtectedRoute allowedRoles={['citizen']}><MyCasesPage /></ProtectedRoute>} />
            <Route path="/citizen/case-status" element={<ProtectedRoute allowedRoles={['citizen']}><CaseStatusPage /></ProtectedRoute>} />
            <Route path="/citizen/book-appointment" element={<ProtectedRoute allowedRoles={['citizen']}><BookAppointmentPage /></ProtectedRoute>} />

            <Route path="/lawyer/dashboard" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerDashboard /></ProtectedRoute>} />
            <Route path="/lawyer/assigned-cases" element={<ProtectedRoute allowedRoles={['lawyer']}><AssignedCasesPage /></ProtectedRoute>} />
            <Route path="/lawyer/client-list" element={<ProtectedRoute allowedRoles={['lawyer']}><ClientListPage /></ProtectedRoute>} />
            <Route path="/lawyer/update-case" element={<ProtectedRoute allowedRoles={['lawyer']}><UpdateCasePage /></ProtectedRoute>} />
            <Route path="/lawyer/schedule-meeting" element={<ProtectedRoute allowedRoles={['lawyer']}><ScheduleMeetingPage /></ProtectedRoute>} />

            <Route path="/judge/dashboard" element={<ProtectedRoute allowedRoles={['judge']}><JudgeDashboard /></ProtectedRoute>} />
            <Route path="/judge/case-list" element={<ProtectedRoute allowedRoles={['judge']}><CaseListPage /></ProtectedRoute>} />
            <Route path="/judge/hearing-schedule" element={<ProtectedRoute allowedRoles={['judge']}><HearingSchedulePage /></ProtectedRoute>} />
            <Route path="/judge/update-judgment" element={<ProtectedRoute allowedRoles={['judge']}><UpdateJudgmentPage /></ProtectedRoute>} />

            <Route path="/police/dashboard" element={<ProtectedRoute allowedRoles={['police']}><PoliceDashboard /></ProtectedRoute>} />
            <Route path="/police/fir-complaints" element={<ProtectedRoute allowedRoles={['police']}><FIRComplaintsPage /></ProtectedRoute>} />
            <Route path="/police/investigation-status" element={<ProtectedRoute allowedRoles={['police']}><InvestigationStatusPage /></ProtectedRoute>} />
            <Route path="/police/upload-reports" element={<ProtectedRoute allowedRoles={['police']}><UploadReportsPage /></ProtectedRoute>} />

            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/manage-users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsersPage /></ProtectedRoute>} />
            <Route path="/admin/manage-roles" element={<ProtectedRoute allowedRoles={['admin']}><ManageRolesPage /></ProtectedRoute>} />
            <Route path="/admin/all-cases" element={<ProtectedRoute allowedRoles={['admin']}><AllCasesPage /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><ReportsPage /></ProtectedRoute>} />

          <Route path="*" element={<RoleRedirect />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <small>Nyay-AI | This is not a substitute for professional legal advice</small>
      </footer>
    </div>
  );
}

function RoleRedirect() {
  const { user } = useAuth();
  return <Navigate to={getRoleHome(user?.role)} replace />;
}

export default function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={getRoleHome(user?.role)} replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to={getRoleHome(user?.role)} replace /> : <RegisterPage />}
      />
      <Route path="/*" element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}
