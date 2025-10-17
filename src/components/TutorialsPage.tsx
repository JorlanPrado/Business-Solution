import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Lock, Play, Clock, Users, Network, Shield, Router, Settings } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Page = 'home' | 'tutorials' | 'pricing' | 'auth' | 'admin';

interface TutorialsPageProps {
  user: { 
    id: string; 
    name: string; 
    email: string; 
    subscription: 'free' | 'premium'; 
    isAdmin?: boolean;
  } | null;
  onNavigate: (page: Page) => void;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isPremium: boolean;
  category: 'basics' | 'security' | 'advanced';
  image: string;
  devices: string[];
}

export function TutorialsPage({ user, onNavigate }: TutorialsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'basics' | 'security' | 'advanced'>('all');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'Network Fundamentals',
      description: 'Learn the basics of networking including OSI model, TCP/IP, and network topologies.',
      duration: '45 min',
      difficulty: 'Beginner',
      isPremium: false,
      category: 'basics',
      image: 'https://images.unsplash.com/photo-1683322499436-f4383dd59f5a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fG5ldHdvcmslMjBmdW5kYW1lbnRhbHN8ZW58MHx8MHx8fDA%3D',
      devices: ['Router', 'Switch', 'Computer']
    },
    {
      id: '2',
      title: 'Router Configuration Basics',
      description: 'Step-by-step guide to configuring routers including static routing and basic security.',
      duration: '60 min',
      difficulty: 'Beginner',
      isPremium: false,
      category: 'basics',
      image: 'https://images.unsplash.com/photo-1744868562210-fffb7fa882d9?q=80&w=1113&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      devices: ['Router', 'Switch']
    },
    {
      id: '3',
      title: 'Firewall Implementation',
      description: 'Advanced firewall configuration and security policies for enterprise networks.',
      duration: '90 min',
      difficulty: 'Advanced',
      isPremium: true,
      category: 'security',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwaW5mcmFzdHJ1Y3R1cmUlMjBjeWJlcnNlY3VyaXR5fGVufDF8fHx8MTc1NzU4MTc5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      devices: ['Firewall', 'Router', 'Switch']
    },
    {
      id: '4',
      title: 'VPN Setup and Configuration',
      description: 'Learn how to set up secure VPN connections for remote access and site-to-site connectivity.',
      duration: '75 min',
      difficulty: 'Intermediate',
      isPremium: true,
      category: 'security',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwaW5mcmFzdHJ1Y3R1cmUlMjBjeWJlcnNlY3VyaXR5fGVufDF8fHx8MTc1NzU4MTc5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      devices: ['VPN Gateway', 'Router', 'Firewall']
    },
    {
      id: '5',
      title: 'Advanced VLAN Configuration',
      description: 'Master VLAN configuration, trunking, and inter-VLAN routing for complex networks.',
      duration: '120 min',
      difficulty: 'Advanced',
      isPremium: true,
      category: 'advanced',
      image: 'https://images.unsplash.com/photo-1750711731797-25c3f2551ff8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      devices: ['Layer 3 Switch', 'Router', 'VLAN']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Tutorials', icon: Network },
    { id: 'basics', label: 'Network Basics', icon: Router },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Settings }
  ];

  const filteredTutorials = selectedCategory === 'all' 
    ? tutorials 
    : tutorials.filter(tutorial => tutorial.category === selectedCategory);

  const canAccessTutorial = (tutorial: Tutorial) => {
    if (!tutorial.isPremium) return true;
    return user?.subscription === 'premium';
  };

  const handleTutorialClick = (tutorial: Tutorial) => {
    if (canAccessTutorial(tutorial)) {
      setSelectedTutorial(tutorial);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedTutorial) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={() => setSelectedTutorial(null)}
            className="mb-6"
          >
            ← Back to Tutorials
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="aspect-video mb-6 rounded-lg overflow-hidden bg-muted">
                <ImageWithFallback
                  src={selectedTutorial.image}
                  alt={selectedTutorial.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h1 className="mb-4 text-3xl">{selectedTutorial.title}</h1>
              <p className="mb-6 text-lg text-muted-foreground">
                {selectedTutorial.description}
              </p>
              
              <div className="prose prose-lg max-w-none">
                <h3>What You'll Learn</h3>
                <ul>
                  <li>Network topology design principles</li>
                  <li>Device configuration best practices</li>
                  <li>Security implementation strategies</li>
                  <li>Troubleshooting common issues</li>
                </ul>
                
                <h3>Tutorial Content</h3>
                <p>This comprehensive tutorial covers all aspects of network configuration...</p>
                
                <div className="not-prose">
                  <Button className="w-full mt-6" size="lg">
                    <Play className="mr-2 h-4 w-4" />
                    Start Tutorial
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tutorial Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedTutorial.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Badge className={getDifficultyColor(selectedTutorial.difficulty)}>
                      {selectedTutorial.difficulty}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Devices Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedTutorial.devices.map((device, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Network className="h-4 w-4 text-muted-foreground" />
                        <span>{device}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.id as any)}
                      >
                        <category.icon className="mr-2 h-4 w-4" />
                        {category.label}
                      </Button>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <h4>Subscription Status</h4>
                    {user ? (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Current Plan: <span className="font-medium">{user.subscription}</span>
                        </div>
                        {user.subscription === 'free' && (
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => onNavigate('pricing')}
                          >
                            Upgrade to Premium
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Sign in to access premium tutorials
                        </p>
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => onNavigate('auth')}
                        >
                          Sign In
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="mb-4 text-3xl">
                {selectedCategory === 'all' ? 'All Tutorials' : 
                 categories.find(c => c.id === selectedCategory)?.label}
              </h1>
              <p className="text-muted-foreground">
                Choose from our comprehensive collection of networking tutorials
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTutorials.map((tutorial) => {
                const hasAccess = canAccessTutorial(tutorial);
                
                return (
                  <Card 
                    key={tutorial.id} 
                    className={`group cursor-pointer transition-all hover:shadow-lg ${
                      !hasAccess ? 'opacity-75' : ''
                    }`}
                    onClick={() => handleTutorialClick(tutorial)}
                  >
                    <CardHeader>
                      <div className="relative">
                        <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={tutorial.image}
                            alt={tutorial.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        {tutorial.isPremium && (
                          <div className="absolute top-2 right-2">
                            {hasAccess ? (
                              <Badge>Premium</Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-gray-100">
                                <Lock className="mr-1 h-3 w-3" />
                                Premium
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-2">{tutorial.title}</CardTitle>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <CardDescription className="mb-4 line-clamp-3">
                        {tutorial.description}
                      </CardDescription>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {tutorial.duration}
                          </span>
                          <Badge className={getDifficultyColor(tutorial.difficulty)}>
                            {tutorial.difficulty}
                          </Badge>
                        </div>
                        
                        {!hasAccess && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('pricing');
                            }}
                          >
                            Subscribe to Unlock
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}