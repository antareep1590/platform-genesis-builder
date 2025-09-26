import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, AlertTriangle, RefreshCw, Rocket } from 'lucide-react';
import { ApplicationStatus } from '../types';
import { useToast } from '@/hooks/use-toast';
import { Confetti, ReducedMotionCelebration } from '../components/Confetti';

interface ApplicationStatusStepProps {
  data: ApplicationStatus;
  onUpdate: (data: ApplicationStatus) => void;
  onNext: () => void;
  onResubmit: () => void;
}

export const ApplicationStatusStep: React.FC<ApplicationStatusStepProps> = ({
  data,
  onUpdate,
  onNext,
  onResubmit
}) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiTriggered, setConfettiTriggered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Trigger confetti when status changes to approved (only once)
  useEffect(() => {
    if (data.status === 'approved' && !confettiTriggered) {
      setShowConfetti(true);
      setConfettiTriggered(true);
      
      // Announce to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = 'Application approved! Your platform is ready to launch.';
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 3000);
    }
  }, [data.status, confettiTriggered]);

  // Polling for status updates
  useEffect(() => {
    if (data.status === 'submitted' || data.status === 'pending') {
      const interval = setInterval(() => {
        // In real implementation, this would check the API
        console.log('Polling for status update...');
      }, 10000); // Poll every 10 seconds
      
      setPollingInterval(interval);
      return () => clearInterval(interval);
    } else if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }, [data.status]);

  useEffect(() => {
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, []);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, randomly update status to approved after refresh
    if (data.status === 'submitted' || data.status === 'pending') {
      const updatedStatus: ApplicationStatus = {
        ...data,
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        message: 'Your application has been approved! You can now launch your platform.'
      };
      onUpdate(updatedStatus);
      
      toast({
        title: "Application Approved!",
        description: "Your platform is ready to launch!",
      });
    } else {
      toast({
        title: "Status Checked",
        description: "No updates to your application status at this time.",
      });
    }
    
    setIsRefreshing(false);
  };

  const handleLaunch = () => {
    toast({
      title: "Launch initialized",
      description: "Your platform launch is now in progress.",
    });
    onNext();
  };

  const isSubmittedState = data.status === 'submitted' || data.status === 'pending';
  const isApprovedState = data.status === 'approved';
  const isDeniedState = data.status === 'denied';

  // Submitted (In Review) State
  if (isSubmittedState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 relative overflow-hidden">
        {/* Subtle background sparkles */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                  <Clock className="w-10 h-10 text-primary animate-pulse" />
                </div>
              </div>
              
              <h1 className="text-5xl font-bold text-foreground leading-tight">
                Application submitted—final review in progress
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Great job completing everything, we'll notify as soon as the review is done.
              </p>
            </div>
            
            {/* Status Card */}
            <Card className="border-2 max-w-md mx-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Status</CardTitle>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-300">
                    Under Review
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.submittedAt && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Submitted:</span> {new Date(data.submittedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
                
                <button
                  onClick={refreshStatus}
                  disabled={isRefreshing}
                  className="text-primary hover:text-primary/80 underline text-sm disabled:opacity-50"
                >
                  {isRefreshing ? 'Checking...' : 'Refresh status'}
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Support Footer */}
        <div className="absolute bottom-8 left-0 right-0">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">Need help?</p>
            <div className="flex justify-center gap-4">
              <a href="mailto:support@revitpay.com" className="text-primary hover:text-primary/80 underline">
                support@revitpay.com
              </a>
              <span>|</span>
              <a href="tel:1-800-555-0123" className="text-primary hover:text-primary/80 underline">
                1-800-555-0123
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Approved (Ready to Launch) State
  if (isApprovedState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-green-50 relative">
        {/* Confetti Animation */}
        {!prefersReducedMotion && <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />}
        {prefersReducedMotion && <ReducedMotionCelebration show={isApprovedState} />}
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-5xl font-bold text-foreground leading-tight">
                Approved—your platform is ready!
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Everything's good to go—start your launch when you're ready.
              </p>
            </div>
            
            {/* Confirmation Card */}
            <Card className="border-2 border-green-200 bg-green-50/50 max-w-md mx-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Verified</span>
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    Approved
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.submittedAt && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Submitted:</span> {new Date(data.submittedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
                {data.reviewedAt && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Reviewed:</span> {new Date(data.reviewedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Primary CTA */}
            <Button 
              onClick={handleLaunch}
              size="lg"
              className="px-12 py-6 text-lg"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Launch platform now
            </Button>
          </div>
        </div>
        
        {/* Support Footer */}
        <div className="absolute bottom-8 left-0 right-0">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">Having trouble launching?</p>
            <div className="flex justify-center gap-4">
              <a href="mailto:support@revitpay.com" className="text-primary hover:text-primary/80 underline">
                support@revitpay.com
              </a>
              <span>|</span>
              <a href="tel:1-800-555-0123" className="text-primary hover:text-primary/80 underline">
                1-800-555-0123
              </a>
            </div>
            <div className="mt-2">
              <a href="/troubleshooting" className="text-xs text-primary hover:text-primary/80 underline">
                View troubleshooting guide →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Fallback for denied or unknown states
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="mb-6">
              {isDeniedState ? (
                <XCircle className="w-16 h-16 text-destructive mx-auto" />
              ) : (
                <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto" />
              )}
            </div>
            
            <h1 className={`text-3xl font-bold ${isDeniedState ? 'text-destructive' : 'text-muted-foreground'}`}>
              {isDeniedState ? 'Application Needs Attention' : 'Application Status Unknown'}
            </h1>
            
            <p className="text-muted-foreground text-lg">
              {isDeniedState 
                ? (data.message || 'Your application requires some additional information. Please review and resubmit.')
                : 'Please contact support for assistance with your application status.'
              }
            </p>
          </div>

          {/* Status Info */}
          {data.submittedAt && (
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground space-y-2">
                  <div>
                    <span className="font-medium">Submitted:</span> {new Date(data.submittedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {data.reviewedAt && (
                    <div>
                      <span className="font-medium">Reviewed:</span> {new Date(data.reviewedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {isDeniedState && data.message && (
            <Card className="border-destructive/20 bg-destructive/5 max-w-md mx-auto">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-destructive mb-2">Review Comments:</h4>
                <p className="text-destructive text-sm">{data.message}</p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            {isDeniedState && (
              <Button onClick={onResubmit}>
                Resubmit Application
              </Button>
            )}
            
            <Button 
              variant="outline"
              onClick={refreshStatus}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Status
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Support Footer */}
      <div className="absolute bottom-8 left-0 right-0">
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">Need help?</p>
          <div className="flex justify-center gap-4">
            <a href="mailto:support@revitpay.com" className="text-primary hover:text-primary/80 underline">
              support@revitpay.com
            </a>
            <span>|</span>
            <a href="tel:1-800-555-0123" className="text-primary hover:text-primary/80 underline">
              1-800-555-0123
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};