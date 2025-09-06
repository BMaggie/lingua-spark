import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, Shield, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup' | 'forgot-password';
  onModeChange: (mode: 'login' | 'signup' | 'forgot-password') => void;
  onAuthSuccess: (user?: { name: string; role: 'admin' | 'user'; isNewUser?: boolean }) => void;
}

const AuthModal = ({ isOpen, onClose, mode, onModeChange, onAuthSuccess }: AuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          toast({
            title: "Login Error",
            description: error.message,
            variant: "destructive"
          });
        } else if (data.user) {
          // Wait a moment for the auth state to update in the AuthProvider
          setTimeout(() => {
            onAuthSuccess();
            onClose();
            toast({
              title: "Welcome back!",
              description: `Logged in successfully`,
            });
          }, 100);
        }
      } else if (mode === 'signup') {
        // Signup
        if (!formData.name || !formData.email || !formData.password) {
          toast({
            title: "Error",
            description: "Please fill in all fields",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              username: formData.name.toLowerCase().replace(/\s+/g, '_'),
              role: formData.role
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          toast({
            title: "Signup Error",
            description: error.message,
            variant: "destructive"
          });
        } else if (data.user) {
          const user = {
            name: formData.name,
            role: formData.role,
            isNewUser: true
          };
          onAuthSuccess(user);
          onClose();
          toast({
            title: "Account created!",
            description: `Welcome to LinguaSpark, ${formData.name}!`,
          });
        }
      } else if (mode === 'forgot-password') {
        // Forgot password
        if (!formData.email) {
          toast({
            title: "Error",
            description: "Please enter your email address",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/auth`,
        });

        if (error) {
          toast({
            title: "Reset Password Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Reset Email Sent!",
            description: "Check your email for password reset instructions",
          });
          onModeChange('login');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Join LinguaSpark';
      case 'forgot-password': return 'Reset Password';
      default: return 'Welcome';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'login': return 'Sign in to your account to continue learning';
      case 'signup': return 'Create an account to start your language journey';
      case 'forgot-password': return 'Enter your email to receive password reset instructions';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {mode === 'forgot-password' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onModeChange('login')}
                className="p-1 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {getTitle()}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
            {mode === 'login' && (
              <p className="text-xs text-gray-500">
                Use email with "admin" for admin access (e.g., admin@test.com)
              </p>
            )}
          </div>

          {mode !== 'forgot-password' && (
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {mode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => onModeChange('forgot-password')}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Account Type
              </Label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === 'user'}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Learner</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Admin</span>
                </label>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {mode === 'login' ? 'Signing in...' : mode === 'signup' ? 'Creating account...' : 'Sending reset email...'}
              </div>
            ) : (
              mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Email'
            )}
          </Button>
        </form>

        {/* Navigation Links */}
        <div className="space-y-3 pt-4 border-t">
          {mode === 'login' && (
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Don't have an account?</p>
              <Button
                variant="ghost"
                onClick={() => onModeChange('signup')}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                Create an account
              </Button>
            </div>
          )}

          {mode === 'signup' && (
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Already have an account?</p>
              <Button
                variant="ghost"
                onClick={() => onModeChange('login')}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                Sign in instead
              </Button>
            </div>
          )}

          {mode === 'forgot-password' && (
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Remember your password?</p>
              <Button
                variant="ghost"
                onClick={() => onModeChange('login')}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                Back to sign in
              </Button>
            </div>
          )}
        </div>

        {/* Additional Help Text */}
        <div className="text-center text-xs text-gray-500">
          {mode === 'login' && "Enter your credentials to access your account"}
          {mode === 'signup' && "All fields are required to create your account"}
          {mode === 'forgot-password' && "We'll send you instructions to reset your password"}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;