import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import DepartmentListPage from './pages/DepartmentListPage';
import DepartmentFormPage from './pages/DepartmentFormPage';
import MyLeavesPage from './pages/MyLeavesPage';
import LeaveApprovalPage from './pages/LeaveApprovalPage';
import ReportsPage from './pages/ReportsPage';
import AuditLogPage from './pages/AuditLogPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/my-leaves" element={<MyLeavesPage />} />

              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/employees" element={<EmployeeListPage />} />
                <Route path="/employees/new" element={<EmployeeFormPage />} />
                <Route path="/employees/:id" element={<EmployeeDetailPage />} />
                <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />

                <Route path="/departments" element={<DepartmentListPage />} />
                <Route path="/departments/new" element={<DepartmentFormPage />} />
                <Route path="/departments/:id/edit" element={<DepartmentFormPage />} />

                <Route path="/leaves" element={<LeaveApprovalPage />} />

                <Route path="/reports" element={<ReportsPage />} />

                <Route path="/audit-logs" element={<AuditLogPage />} />
              </Route>
              {/* Department/Leave/Report/Audit screens are added
                  here as their own ProtectedRoute groups in later tasks */}
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
