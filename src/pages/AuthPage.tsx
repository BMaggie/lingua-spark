import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/AuthModal';

const AuthPage = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password'>('signup');
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only navigate if user is authenticated AND not loading
    if (isAuthenticated && user && !isLoading) {
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  const handleAuthSuccess = () => {
    // AuthProvider will handle the redirect via useEffect above
    // Adding a small delay to ensure user object is fully loaded
    setTimeout(() => {
      if (isAuthenticated && user) {
        navigate(user.role === 'admin' ? '/admin' : '/');
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            LinguaSpark
          </h1>
          <p className="text-gray-600">
            {authMode === 'login' ? 'Welcome back!' : 'Join us today!'}
          </p>
        </div>
        
        <AuthModal
          isOpen={true}
          onClose={() => navigate('/')}
          mode={authMode}
          onModeChange={setAuthMode}
          onAuthSuccess={handleAuthSuccess}
        />
        
      </div>
    </div>
  );
};

export default AuthPage;