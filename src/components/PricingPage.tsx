import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Check, Crown, Users } from 'lucide-react';
import gcashIcon from "../assets/gcash.png";

type Page = 'home' | 'tutorials' | 'pricing' | 'auth' | 'admin';

interface PricingPageProps {
  user: {
    id: string;
    name: string;
    email: string;
    subscription: 'free' | 'premium';
    isAdmin?: boolean;
  } | null;
  onNavigate: (page: Page) => void;
}

export function PricingPage({ user, onNavigate }: PricingPageProps) {
  const plans = [
    {
      name: 'Free',
      price: '₱0',
      period: 'forever',
      description: 'Perfect for getting started with networking basics',
      features: [
        'Access to basic networking tutorials',
        'Community support',
        'Basic network diagrams',
        'Limited configuration examples',
        'Email support'
      ],
      limitations: [
        'No advanced tutorials',
        'No premium content',
        'Limited device configurations'
      ],
      buttonText: user?.subscription === 'free' ? 'Current Plan' : 'Get Started',
      isPopular: false,
      disabled: user?.subscription === 'free'
    },
    {
      name: 'Premium',
      price: '₱299',
      period: 'per month',
      description: 'Complete access to all networking and security content',
      features: [
        'Access to ALL tutorials and guides',
        'Advanced security configurations',
        'Interactive network simulators',
        'Step-by-step video walkthroughs',
        'Downloadable configuration files',
        'Priority email support',
        'Monthly live Q&A sessions',
        'Certificate of completion',
        'Advanced troubleshooting guides',
        'Enterprise-level scenarios'
      ],
      limitations: [],
      buttonText: user?.subscription === 'premium' ? 'Current Plan' : 'Subscribe Now',
      isPopular: true,
      disabled: user?.subscription === 'premium'
    }
  ];

  const handleSubscribe = (planName: string) => {
    if (!user) {
      onNavigate('auth');
      return;
    }

    if (planName === 'Premium' && user.subscription !== 'premium') {
      // In a real app, this would integrate with a payment processor
      alert('Payment integration would be implemented here. For demo purposes, your subscription has been upgraded!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-primary/5 to-secondary/10">
        <div className="container mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl md:text-5xl">
            Unlock Full Access
          </h1>
          <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan to advance your networking and cybersecurity skills
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.isPopular ? 'border-primary shadow-lg scale-105' : ''
                  }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Crown className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-medium">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                  </div>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">
                    {/* Features */}
                    <div>
                      <h4 className="font-medium mb-3">What's Included:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Limitations (for free plan) */}
                    {plan.limitations.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 text-muted-foreground">Limitations:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, limitIndex) => (
                            <li key={limitIndex} className="flex items-start space-x-2">
                              <div className="h-5 w-5 rounded-full bg-muted mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      size="lg"
                      variant={plan.isPopular ? "default" : "outline"}
                      disabled={plan.disabled}
                      onClick={() => handleSubscribe(plan.name)}
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Options */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-2xl">Secure Payment Options</h2>
          <p className="mb-8 text-muted-foreground">
            Your payment information is secure and encrypted. Cancel anytime.
          </p>

          <div className="flex justify-center">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-lg">GCash</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Pay securely with your GCash account
                </p>
                <div className="mt-4 p-4 bg-muted rounded-lg flex items-center justify-center space-x-2">
                  <img
                    src={gcashIcon}
                    alt="GCash"
                    className="h-5 w-5 object-contain"
                  />
                  <p className="text-xs text-muted-foreground">
                    Pay easily with GCash
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-12 text-3xl text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="mb-2 text-lg">Can I cancel my subscription anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. You'll continue to have access to premium content until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg">Do you offer a money-back guarantee?</h3>
              <p className="text-muted-foreground">
                We offer a 30-day money-back guarantee. If you're not satisfied with the premium content, contact us for a full refund.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg">What devices and platforms are covered?</h3>
              <p className="text-muted-foreground">
                Our tutorials cover Cisco, Juniper, Fortinet, and other major networking equipment. We also include virtualized environments and cloud networking.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg">Is there a student discount available?</h3>
              <p className="text-muted-foreground">
                Yes! We offer a 50% discount for students with valid academic email addresses. Contact support for details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl">
            Ready to Master Networking?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands of professionals who have advanced their careers with our comprehensive training.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>5,000+ Students</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4" />
              <span>99% Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}