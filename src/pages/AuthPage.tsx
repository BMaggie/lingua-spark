import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/AuthModal';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') as 'login' | 'signup' | 'forgot-password';
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password'>(mode || 'signup');
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only navigate if user is authenticated AND not loading
    if (isAuthenticated && user && !isLoading) {
      console.log('AuthPage: User authenticated, role:', user.role);
      // Redirect based on role with a small delay to ensure state is settled
      setTimeout(() => {
        if (user.role === 'admin') {
          console.log('AuthPage: Redirecting admin to /admin');
          navigate('/admin', { replace: true });
        } else {
          console.log('AuthPage: Redirecting user to dashboard');
          navigate('/', { replace: true });
        }
      }, 100);
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  const handleAuthSuccess = (userData?: { isNewUser?: boolean }) => {
    // For immediate redirect without waiting for useEffect
    setTimeout(() => {
      // Force a refresh of auth state and then navigate
      window.location.reload();
    }, 200);
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