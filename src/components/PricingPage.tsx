import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Check, Crown, Users, X } from 'lucide-react';
import gcashIcon from "../assets/gcash.png";
import { supabase } from '../supabaseClient';

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
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [gcashNumber, setGcashNumber] = useState('');
  const [errors, setErrors] = useState<{ gcash?: string }>({});
  const [processing, setProcessing] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

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
      buttonText: user?.subscription === 'free' ? 'Current Plan' : 'Downgrade',
      isPopular: false,
      disabled: true // Always disabled - can't switch to free or stay on free
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

  const openPaymentModal = (planName: string) => {
    if (!user) {
      onNavigate('auth');
      return;
    }

    if (planName === 'Free' && user.subscription === 'free') return;
    if (planName === 'Premium' && user.subscription === 'premium') return;

    setSelectedPlan(planName);
    setGcashNumber('');
    setErrors({});
    setResultMessage(null);
    setShowModal(true);
  };

  const validateGcash = (num: string) => {
    const local = /^09\d{9}$/;
    const intl = /^\+639\d{9}$/;
    if (!num) return 'GCash number is required';
    if (!local.test(num) && !intl.test(num)) return 'Enter a valid GCash number (e.g. 09XXXXXXXXX or +639XXXXXXXXX)';
    return null;
  };

  const handleDemoPayment = async () => {
    setErrors({});
    setResultMessage(null);

    const err = validateGcash(gcashNumber.trim());
    if (err) {
      setErrors({ gcash: err });
      return;
    }

    if (!user) {
      onNavigate('auth');
      return;
    }

    setProcessing(true);
    setResultMessage(null);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Update Supabase profile to premium
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ subscription: 'premium' })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProcessing(false);
      setResultMessage('Payment successful! Your account has been upgraded to Premium.');

      // Close modal and redirect to home
      setTimeout(() => {
        setShowModal(false);
        setResultMessage(null);
        setSelectedPlan(null);
        onNavigate('home'); // Navigate to home, app will refresh user data
        window.location.reload(); // Refresh to update user state from database
      }, 1500);

    } catch (dbErr: any) {
      setProcessing(false);
      setResultMessage(`Payment succeeded but updating subscription failed: ${dbErr.message || dbErr}`);
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
                className={`relative ${plan.isPopular ? 'border-primary shadow-lg scale-105' : ''}`}
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
                      onClick={() => openPaymentModal(plan.name)}
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

      {/* Demo Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              if (!processing) {
                setShowModal(false);
                setResultMessage(null);
              }
            }}
          />
          <div className="relative w-full max-w-md mx-4 bg-background rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center space-x-3">
                <img src={gcashIcon} alt="GCash" className="h-6 w-6 object-contain" />
                <div>
                  <div className="font-medium">GCash Demo Payment</div>
                  <div className="text-xs text-muted-foreground">Plan: {selectedPlan}</div>
                </div>
              </div>
              <button
                className="p-2 rounded hover:bg-muted/40"
                onClick={() => {
                  if (!processing) {
                    setShowModal(false);
                    setResultMessage(null);
                  }
                }}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm text-muted-foreground mb-4">
                This is a demo payment flow. No real payment will be processed. Enter your GCash number to continue.
              </p>

              <label className="block text-sm mb-2">GCash Number</label>
              <input
                value={gcashNumber}
                onChange={(e) => setGcashNumber(e.target.value)}
                placeholder="09XXXXXXXXX or +639XXXXXXXXX"
                className="w-full px-3 py-2 rounded border bg-white/5 text-sm"
                disabled={processing}
              />
              {errors.gcash && <p className="text-xs text-red-600 mt-2">{errors.gcash}</p>}

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Demo price: <strong>₱299</strong>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (!processing) {
                        setShowModal(false);
                        setResultMessage(null);
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleDemoPayment} disabled={processing}>
                    {processing ? 'Processing...' : 'Pay (Demo)'}
                  </Button>
                </div>
              </div>

              {resultMessage && (
                <div className="mt-4 p-3 rounded bg-muted/40 text-sm">
                  {resultMessage}
                </div>
              )}

              <div className="mt-3 text-xs text-muted-foreground">
                <strong>Note:</strong> This is a simulation for demo purposes only — no real transaction will occur and subscriptions are updated in the database for demo.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}