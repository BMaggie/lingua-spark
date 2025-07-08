
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onAuthSuccess: (user: { name: string; role: 'admin' | 'user' }) => void;
}

const AuthModal = ({ isOpen, onClose, mode, onAuthSuccess }: AuthModalProps) => {
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
          const user = {
            name: data.user.email?.split('@')[0] || 'User',
            role: data.user.email?.includes('admin') ? 'admin' as const : 'user' as const
          };
          onAuthSuccess(user);
          onClose();
          toast({
            title: "Welcome back!",
            description: `Logged in successfully`,
          });
        }
      } else {
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
              name: formData.name,
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
            role: formData.role
          };
          onAuthSuccess(user);
          onClose();
          toast({
            title: "Account created!",
            description: `Welcome to LinguaSpark, ${formData.name}!`,
          });
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {mode === 'login' ? 'Welcome Back' : 'Join LinguaSpark'}
          </DialogTitle>
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
                {/* Use email with "admin" for admin access (e.g., admin@test.com) */}
              </p>
            )}
          </div>

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
          </div>

          {mode === 'signup' && (
            <div className="space-y-2">
              {/* <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Account Type
              </Label> */}
              <div className="flex gap-4">
                {/* <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === 'user'}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Learner</span>
                </label> */}
                {/* <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Admin</span>
                </label> */}
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
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </div>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          {mode === 'login' ? (
            <p>Enter your credentials to access your account</p>
          ) : (
            <p>All fields are required to create your account</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
