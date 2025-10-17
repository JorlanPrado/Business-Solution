import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, Network, BookOpen, Lock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Page = 'home' | 'tutorials' | 'pricing' | 'auth' | 'admin';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

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
            <Button size="lg" onClick={() => onNavigate('auth')}>
              Get Started Free
            </Button>
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
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-medium">NetLearn</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 NetLearn. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}