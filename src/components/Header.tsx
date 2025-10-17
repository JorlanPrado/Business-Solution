import { Shield, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

type Page = 'home' | 'tutorials' | 'pricing' | 'auth' | 'admin';

interface HeaderProps {
  user: { 
    id: string; 
    name: string; 
    email: string; 
    subscription: 'free' | 'premium'; 
    isAdmin?: boolean;
  } | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  currentPage: Page;
}

export function Header({ user, onNavigate, onLogout, currentPage }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Home', page: 'home' as Page },
    { label: 'Tutorials', page: 'tutorials' as Page },
    { label: 'Pricing', page: 'pricing' as Page },
  ];

  if (user?.isAdmin) {
    menuItems.push({ label: 'Admin', page: 'admin' as Page });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="font-medium">NetLearn</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 ml-8">
          {menuItems.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`text-sm transition-colors hover:text-primary ${
                currentPage === item.page ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4 ml-auto">
          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.name}
              </span>
              {user.subscription === 'premium' && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                  Premium
                </span>
              )}
              <Button variant="outline" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigate('auth')}
              >
                Login
              </Button>
              <Button 
                size="sm" 
                onClick={() => onNavigate('auth')}
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 border-t">
            {menuItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setIsMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 text-sm w-full text-left transition-colors hover:text-primary ${
                  currentPage === item.page ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {user ? (
              <div className="px-3 py-2 space-y-2">
                <div className="text-sm text-muted-foreground">
                  Welcome, {user.name}
                </div>
                {user.subscription === 'premium' && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Premium
                  </span>
                )}
                <Button variant="outline" size="sm" onClick={onLogout} className="w-full">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    onNavigate('auth');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Login
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => {
                    onNavigate('auth');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}