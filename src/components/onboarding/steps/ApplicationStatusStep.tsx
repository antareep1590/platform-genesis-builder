import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, AlertTriangle, RefreshCw, Rocket, Copy, Eye, Users, Settings, Volume2, VolumeX } from 'lucide-react';
import { ApplicationStatus } from '../types';
import { useToast } from '@/hooks/use-toast';
import { Confetti, ReducedMotionCelebration } from '../components/Confetti';
import { ProgressChecklist } from '../components/ProgressChecklist';
import { PreLaunchChecklist } from '../components/PreLaunchChecklist';

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
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
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

  // Trigger confetti when status changes to approved
  useEffect(() => {
    if (data.status === 'approved' && !showConfetti) {
      setShowConfetti(true);
      if (soundEnabled) {
        // Play success sound (would be implemented with audio file)
        console.log('Playing success sound');
      }
    }
  }, [data.status, showConfetti, soundEnabled]);

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
    
    // Simulate API call to check status with exponential backoff
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, randomly update status to approved after refresh
    // In real app, this would come from your backend
    if (data.status === 'submitted' || data.status === 'pending') {
      const updatedStatus: ApplicationStatus = {
        ...data,
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        message: 'Your application has been approved! You can now continue to launch your platform.'
      };
      onUpdate(updatedStatus);
      
      // Announce to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = 'Application approved! You can now launch your platform.';
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 3000);
      
      toast({
        title: "🎉 Application Approved!",
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

  const copyLaunchUrl = async () => {
    const url = 'https://your-platform.revitpay.com';
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copied!",
        description: "Launch URL copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the URL manually",
        variant: "destructive"
      });
    }
  };
  const isSubmittedState = data.status === 'submitted' || data.status === 'pending';
  const isApprovedState = data.status === 'approved';
  const isDeniedState = data.status === 'denied';

  const renderSubmittedState = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Confetti Animation */}
      {!prefersReducedMotion && <Confetti trigger={false} />}
      {prefersReducedMotion && <ReducedMotionCelebration show={false} />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Hero and Checklist */}
          <div className="space-y-6">
            {/* Hero Panel */}
            <div className="text-center lg:text-left">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Clock className="w-8 h-8 text-primary animate-pulse" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                All steps complete—review in progress
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Great job finishing onboarding! We'll notify you once the final check is done.
              </p>
              
              {/* Encouragement Band */}
              <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
                <CheckCircle className="w-4 h-4 animate-pulse" />
                <span>Almost there! Review typically takes 2-4 hours.</span>
              </div>
            </div>
            
            {/* Progress Checklist */}
            <ProgressChecklist currentStatus={data.status} />
          </div>
          
          {/* Right Column - Status and Actions */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Application Status</CardTitle>
                  <Badge variant="secondary">In Review</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.submittedAt && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Submitted:</span> {new Date(data.submittedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Estimated review completion: {new Date(Date.now() + 4 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col space-y-3">
                  <Button 
                    onClick={onNext}
                    className="w-full"
                    size="lg"
                  >
                    Continue Pre-Launch Checklist
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    onClick={refreshStatus}
                    disabled={isRefreshing}
                    className="w-full"
                  >
                    {isRefreshing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Checking Status...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Status
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Pre-Launch Checklist */}
            <PreLaunchChecklist 
              isOpen={checklistOpen} 
              onToggle={() => setChecklistOpen(!checklistOpen)} 
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderApprovedState = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50">
      {/* Confetti Animation */}
      {!prefersReducedMotion && <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />}
      {prefersReducedMotion && <ReducedMotionCelebration show={isApprovedState} />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Celebration Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <Rocket className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Application Approved—your platform is ready!
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Everything's set to go live when you are.
            </p>
          </div>
          
          {/* Confirmation Card */}
          <Card className="border-2 border-green-200 bg-green-50/50 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span>Application Verified</span>
                </CardTitle>
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  Approved
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {data.submittedAt && (
                  <div className="bg-white/70 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Submitted:</span> {new Date(data.submittedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
                {data.reviewedAt && (
                  <div className="bg-white/70 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Reviewed:</span> {new Date(data.reviewedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Primary Launch Card */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-lg">Ready to Launch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={onNext}
                  size="lg"
                  className="w-full"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Launch Platform Now
                </Button>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open('https://your-platform.revitpay.com', '_blank')}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Storefront
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Invite Teammates
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Launch Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Launch Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Launch URL:</span>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-background px-2 py-1 rounded">
                        your-platform.revitpay.com
                      </code>
                      <Button size="sm" variant="ghost" onClick={copyLaunchUrl}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Test Mode:</span>
                    <Button size="sm" variant="outline">
                      <Settings className="mr-1 h-3 w-3" />
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Launch Sound:</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                    >
                      {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic with state machine
  if (isApprovedState) {
    return renderApprovedState();
  }
  
  if (isSubmittedState) {
    return renderSubmittedState();
  }
  
  // Fallback for denied or unknown states
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Application Status</h1>
            <p className="text-muted-foreground text-lg">RevitPay Pre-Application Review</p>
          </div>

          {/* Status Card */}
          <Card className="text-center border-2">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                {isDeniedState ? (
                  <XCircle className="w-16 h-16 text-destructive" />
                ) : (
                  <AlertTriangle className="w-16 h-16 text-muted-foreground" />
                )}
              </div>
              <CardTitle className={`text-2xl ${isDeniedState ? 'text-destructive' : 'text-muted-foreground'}`}>
                {isDeniedState ? 'Application Needs Attention' : 'Application Status Unknown'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {isDeniedState 
                  ? (data.message || 'Your application requires some additional information. Please review and resubmit.')
                  : 'Please contact support for assistance with your application status.'
                }
              </p>

              {data.submittedAt && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Submitted:</span> {new Date(data.submittedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {data.reviewedAt && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium">Reviewed:</span> {new Date(data.reviewedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              )}

              {isDeniedState && data.message && (
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg text-left">
                  <h4 className="font-semibold text-destructive mb-2">Review Comments:</h4>
                  <p className="text-destructive text-sm">{data.message}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                {isDeniedState && (
                  <Button 
                    onClick={onResubmit}
                    className="px-8 py-3"
                  >
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
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">Having trouble launching?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  If you have questions about your application status, our support team is here to help.
                </p>
                <div className="flex justify-center gap-4 text-sm">
                  <a href="mailto:support@revitpay.com" className="text-primary hover:text-primary/80 underline">
                    support@revitpay.com
                  </a>
                  <span className="text-muted-foreground">|</span>
                  <a href="tel:1-800-555-0123" className="text-primary hover:text-primary/80 underline">
                    1-800-555-0123
                  </a>
                </div>
                <div className="mt-3">
                  <a href="/troubleshooting" className="text-xs text-primary hover:text-primary/80 underline">
                    View troubleshooting guide →
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};