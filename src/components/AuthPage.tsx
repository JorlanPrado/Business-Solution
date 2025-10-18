import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabaseClient';

type Page = 'home' | 'tutorials' | 'pricing' | 'auth' | 'admin';

interface AuthPageProps {
  onLogin: (userData: { 
    id: string; 
    name?: string | null; 
    email: string; 
    subscription: 'free' | 'premium'; 
    isAdmin?: boolean;
    role?: string;
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
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!isLogin) {
      // You previously chose signup with Email+Password only, but this keeps the optional name field if UI shows it
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;
        if (!data.user) throw new Error('Login failed');

        // fetch profile from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        // Call parent with profile info (subscription, role, isAdmin)
        onLogin({
          id: data.user.id,
          name: profile.name ?? null,
          email: data.user.email ?? '',
          subscription: profile.subscription ?? 'free',
          isAdmin: profile.isAdmin ?? false,
          role: profile.role ?? 'user'
        });

        // navigate to home after login
        onNavigate('home');

      } else {
        // --- SIGNUP ---
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;
        if (!data.user) throw new Error('Signup failed');

        // Insert profile after signup (RLS-friendly)
        const { error: profileError } = await supabase.from('profiles').insert([{
          id: data.user.id,
          name: formData.name || null,
          email: formData.email,
          subscription: 'free',
          role: 'user',       // add role
          isAdmin: false      // keep isAdmin
        }]);

        if (profileError) throw profileError;

        // Notify parent and navigate home
        onLogin({
          id: data.user.id,
          name: formData.name || null,
          email: data.user.email ?? formData.email,
          subscription: 'free',
          isAdmin: false,
          role: 'user'
        });

        onNavigate('home');
      }

    } catch (err: any) {
      // Prefer showing friendly messages
      const message = err?.message || 'Something went wrong';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-medium">NetLearn</span>
          </div>
          <p className="text-muted-foreground">{isLogin ? 'Welcome back' : 'Create your account'}</p>
        </div>

        {/* Auth Form */}
        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
            <CardDescription>{isLogin ? 'Enter your credentials to access your account' : 'Create an account to start learning'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    className="bg-gray-200"
                    id="name"
                    type="text"
                    placeholder="Enter your full name (optional)"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="bg-gray-200"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    className="bg-gray-200"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    className="bg-gray-200"
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={e => handleInputChange('confirmPassword', e.target.value)}
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6">
              <Separator />
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
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

        <div className="text-center">
          <Button variant="ghost" onClick={() => onNavigate('home')} className="text-muted-foreground">
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
