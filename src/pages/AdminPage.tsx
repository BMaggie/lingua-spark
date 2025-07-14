import { useAuth } from '@/hooks/useAuth';
import AdminDashboard from '@/components/AdminDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminPage = () => {
  const { signOut, user } = useAuth();

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <AdminDashboard 
          user={{ 
            name: user?.profile.full_name || user?.email || 'Admin', 
            role: 'admin' 
          }}
          onLogout={signOut}
        />
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;