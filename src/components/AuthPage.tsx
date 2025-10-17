import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Shield, Eye, EyeOff } from 'lucide-react';

type Page = 'home' | 'tutorials' | 'pricing' | 'auth' | 'admin';

interface AuthPageProps {
  onLogin: (userData: { 
    id: string; 
    name: string; 
    email: string; 
    subscription: 'free' | 'premium'; 
    isAdmin?: boolean;
  }) => void;
  onNavigate: (page: Page) => void;
}

export function AuthPage({ onLogin, onNavigate }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Mock authentication - in a real app, this would call an API
    const userData = {
      id: '1',
      name: formData.name || 'Demo User',
      email: formData.email,
      subscription: formData.email === 'admin@netlearn.com' ? 'premium' as const : 'free' as const,
      isAdmin: formData.email === 'admin@netlearn.com'
    };

    onLogin(userData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const demoCredentials = [
    { email: 'demo@netlearn.com', password: 'demo123', type: 'Free User' },
    { email: 'premium@netlearn.com', password: 'premium123', type: 'Premium User' },
    { email: 'admin@netlearn.com', password: 'admin123', type: 'Admin User' }
  ];

  return (
    <div className="bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-medium">NetLearn</span>
          </div>
          <p className="text-muted-foreground">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Auth Form */}
        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Enter your credentials to access your account' 
                : 'Create an account to start learning'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input className='bg-gray-200'
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input className='bg-gray-200'
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input className='bg-gray-200'
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input className='bg-gray-200'
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
              
              <Button type="submit" className="w-full" size="lg">
                {isLogin ? 'Login' : 'Create Account'}
              </Button>
            </form>
            
            <div className="mt-6">
              <Separator />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {isLogin ? 'New to NetLearn?' : 'Already have an account?'}
                  </span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                  setErrors({});
                }}
              >
                {isLogin ? 'Create Account' : 'Login'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg">Demo Credentials</CardTitle>
            <CardDescription>
              Use these credentials to explore different user types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoCredentials.map((cred, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      email: cred.email,
                      password: cred.password
                    }));
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{cred.type}</p>
                      <p className="text-xs text-muted-foreground">{cred.email}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Click to fill</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Back to Home */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="text-muted-foreground"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}