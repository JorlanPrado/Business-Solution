import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, Network, BookOpen, Lock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Page = 'home' | 'tutorials' | 'pricing' | 'auth' | 'admin';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  subscription: 'free' | 'premium' | null;
}

const RoutifyLogo = ({ className = "h-8 w-8" }) => {
  return (
    <svg 
      className={className}
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

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: Network,
      title: "Interactive Diagrams",
      description: "Visualize network topology with interactive diagrams that help you understand how devices connect and communicate.",
      image: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      icon: BookOpen,
      title: "Step-by-Step Guides",
      description: "Follow comprehensive tutorials that break down complex networking concepts into easy-to-understand steps.",
      image: "https://images.unsplash.com/photo-1520869562399-e772f042f422?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      icon: Shield,
      title: "Cybersecurity Tutorials",
      description: "Learn essential security practices to protect your network infrastructure from threats and vulnerabilities.",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwaW5mcmFzdHJ1Y3R1cmUlMjBjeWJlcnNlY3VyaXR5fGVufDF8fHx8MTc1NzU4MTc5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/10">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="mb-6 text-4xl md:text-6xl">
            Learn Network Infrastructure & Security
          </h1>
          <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
            Understand how devices work, how to configure them, and secure your network with our comprehensive tutorials and interactive learning tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => onNavigate('pricing')}>
              Subscribe Now
            </Button>
            <Button variant="outline" size="lg" onClick={() => onNavigate('tutorials')}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl md:text-4xl">
              Everything You Need to Master Networking
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines visual learning with hands-on practice to help you become a networking expert.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <feature.icon className="h-8 w-8 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="mb-4 text-3xl md:text-4xl">
            Ready to Start Learning?
          </h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Join thousands of students who have mastered network infrastructure and security with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Button size="lg" onClick={() => onNavigate('auth')}>
              Get Started Free
            </Button> */}
            <Button variant="outline" size="lg" onClick={() => onNavigate('tutorials')}>
              Browse Tutorials
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-muted/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <RoutifyLogo className="h-6 w-6" />
              <span className="font-medium">Routify</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 Routify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}