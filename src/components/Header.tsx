import { Menu, X } from 'lucide-react';
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

const RoutifyLogo = () => {
  return (
    <svg 
      className="h-8 w-8" 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#1e40af', stopOpacity: 1}} />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: '#06b6d4', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <g transform="translate(25, 20)">
        <line x1="25" y1="15" x2="25" y2="45" stroke="url(#accentGradient)" strokeWidth="4" opacity="0.6"/>
        <line x1="25" y1="15" x2="45" y2="15" stroke="url(#accentGradient)" strokeWidth="4" opacity="0.6"/>
        <line x1="45" y1="15" x2="45" y2="30" stroke="url(#accentGradient)" strokeWidth="4" opacity="0.6"/>
        <line x1="45" y1="30" x2="25" y2="30" stroke="url(#accentGradient)" strokeWidth="4" opacity="0.6"/>
        <line x1="25" y1="30" x2="45" y2="50" stroke="url(#accentGradient)" strokeWidth="4" opacity="0.6"/>
        <line x1="25" y1="45" x2="25" y2="60" stroke="url(#accentGradient)" strokeWidth="4" opacity="0.6"/>
        
        <path 
          d="M 10 10 L 25 5 L 40 10 L 40 28 C 40 38, 35 47, 25 52 C 15 47, 10 38, 10 28 Z" 
          fill="none" 
          stroke="url(#primaryGradient)" 
          strokeWidth="3"
          opacity="0.4"
        />
        
        <circle cx="25" cy="15" r="7" fill="url(#primaryGradient)" filter="url(#glow)"/>
        <circle cx="25" cy="30" r="7" fill="url(#primaryGradient)" filter="url(#glow)"/>
        <circle cx="25" cy="45" r="7" fill="url(#primaryGradient)" filter="url(#glow)"/>
        <circle cx="25" cy="60" r="7" fill="url(#primaryGradient)" filter="url(#glow)"/>
        <circle cx="45" cy="15" r="7" fill="url(#primaryGradient)" filter="url(#glow)"/>
        <circle cx="45" cy="30" r="7" fill="url(#primaryGradient)" filter="url(#glow)"/>
        <circle cx="45" cy="50" r="7" fill="url(#primaryGradient)" filter="url(#glow)"/>
        
        <g transform="translate(25, 30)">
          <rect x="-3" y="-1.5" width="6" height="5" fill="white" rx="0.5"/>
          <path 
            d="M -2 -1.5 L -2 -3 C -2 -4, -1 -5, 0 -5 C 1 -5, 2 -4, 2 -3 L 2 -1.5" 
            fill="none" 
            stroke="white" 
            strokeWidth="1.5"
          />
          <circle cx="0" cy="1" r="1" fill="white" opacity="0.8"/>
        </g>
      </g>
    </svg>
  );
};

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
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <RoutifyLogo />
          <span className="font-medium">Routify</span>
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
              <button 
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <button 
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => onNavigate('auth')}
              >
                Login
              </button>
              <button 
                className="px-4 py-1.5 text-sm bg-black text-white rounded hover:bg-black transition-colors rounded:sm"
                onClick={() => onNavigate('auth')}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
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
                <button 
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <button 
                  className="w-full px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                  onClick={() => {
                    onNavigate('auth');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Login
                </button>
                <button 
                  className="w-full px-4 py-1.5 text-sm bg-black text-white rounded hover:bg-black transition-colors"
                  onClick={() => {
                    onNavigate('auth');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}