import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/AuthModal';

const AuthPage = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleAuthSuccess = () => {
    // AuthProvider will handle the redirect via useEffect above
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
          onClose={() => {}}
          mode={authMode}
          onAuthSuccess={handleAuthSuccess}
        />
        
        <div className="text-center">
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            {authMode === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Log in"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;