import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { TutorialsPage } from './components/TutorialsPage';
import { PricingPage } from './components/PricingPage';
import { AuthPage } from './components/AuthPage';
import { AdminDashboard } from './components/AdminDashboard';
import { Header } from './components/Header';

type Page = 'home' | 'tutorials' | 'pricing' | 'auth' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<{ 
    id: string; 
    name: string; 
    email: string; 
    subscription: 'free' | 'premium'; 
    isAdmin?: boolean;
  } | null>(null);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLogin = (userData: { 
    id: string; 
    name: string; 
    email: string; 
    subscription: 'free' | 'premium'; 
    isAdmin?: boolean;
  }) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'tutorials':
        return <TutorialsPage user={user} onNavigate={navigateTo} />;
      case 'pricing':
        return <PricingPage user={user} onNavigate={navigateTo} />;
      case 'auth':
        return <AuthPage onLogin={handleLogin} onNavigate={navigateTo} />;
      case 'admin':
        return user?.isAdmin ? <AdminDashboard /> : <HomePage onNavigate={navigateTo} />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onNavigate={navigateTo} 
        onLogout={handleLogout}
        currentPage={currentPage}
      />
      <main>
        {renderPage()}
      </main>
    </div>
  );
}