
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Rocket, ExternalLink, Settings, Users, Globe, Check, Star, Clock, AlertCircle, Copy, Loader2 } from 'lucide-react';
import { OnboardingData } from '../types';

interface LaunchStepProps {
  onboardingData: OnboardingData;
  onPrev: () => void;
  isApproved?: boolean;
}

export const LaunchStep: React.FC<LaunchStepProps> = ({
  onboardingData,
  onPrev,
  isApproved = false
}) => {
  const { businessInfo, branding, domain, template, applicationStatus } = onboardingData;
  const [isLaunched, setIsLaunched] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  React.useEffect(() => {
    if (isApproved && applicationStatus?.status === 'approved') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [isApproved, applicationStatus?.status]);
  
  const platformUrl = domain.domainOption === 'custom' 
    ? domain.customDomain 
    : domain.domainOption === 'subdomain'
    ? `${domain.subdomain || 'your-business'}.hyrhealth.com`
    : 'your-new-domain.com';

  const adminUrl = `admin.${platformUrl}`;

  // Get domain status and configuration based on domain option
  const getDomainConfig = () => {
    if (!isLaunched) {
      return {
        status: 'ready',
        statusText: 'Ready to Launch',
        statusColor: 'text-slate-600',
        customerPortalActive: false,
        merchantPortalActive: false,
        showDnsRecords: false,
        message: ''
      };
    }

    switch (domain.domainOption) {
      case 'subdomain':
        return {
          status: 'live',
          statusText: 'Live',
          statusColor: 'text-green-600',
          customerPortalActive: true,
          merchantPortalActive: true,
          showDnsRecords: false,
          message: 'Your platform is live!'
        };
      case 'purchase':
        return {
          status: 'propagating',
          statusText: 'Propagation in progress',
          statusColor: 'text-yellow-600',
          customerPortalActive: false,
          merchantPortalActive: true,
          showDnsRecords: false,
          message: 'Your domain purchase is complete. DNS setup is in progress. This may take a few hours.'
        };
      case 'custom':
        return {
          status: 'awaiting',
          statusText: 'Pending DNS verification',
          statusColor: 'text-orange-600',
          customerPortalActive: false,
          merchantPortalActive: true,
          showDnsRecords: true,
          message: 'Please add the following DNS records in your domain provider to complete setup.'
        };
      default:
        return {
          status: 'ready',
          statusText: 'Ready',
          statusColor: 'text-slate-600',
          customerPortalActive: false,
          merchantPortalActive: false,
          showDnsRecords: false,
          message: ''
        };
    }
  };

  const domainConfig = getDomainConfig();

  const handleLaunch = async () => {
    setIsLaunching(true);
    // Simulate platform launch
    console.log('Launching platform with data:', onboardingData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLaunched(true);
    setIsLaunching(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 relative">
      {showConfetti && !prefersReducedMotion && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 animate-fade-in">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-green-500 rounded-full animate-fade-out"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {isApproved && applicationStatus?.status === 'approved' && (
        <Card className="p-6 shadow-lg border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 mb-6">
          <div className="text-center">
            <div className="p-4 bg-green-500 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center animate-scale-in">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-2">
              🎉 Application Approved!
            </h3>
            <p className="text-lg text-green-800 mb-4">
              Congratulations! Your application has been approved and deployment is in progress.
            </p>
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Setting up your platform...</span>
            </div>
            <p className="text-sm text-green-600 mt-3">
              You'll be notified via email at <strong>{businessInfo.supportEmail}</strong> when deployment is complete.
            </p>
            {applicationStatus?.reviewedAt && (
              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="flex items-center justify-center space-x-4 text-sm text-green-700">
                  <div>
                    <span className="font-medium">Submitted:</span> {new Date(applicationStatus.submittedAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Approved:</span> {new Date(applicationStatus.reviewedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="text-center mb-8">
        <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Rocket className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          {isLaunched ? 'Platform Status' : 'Ready to Launch!'}
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {isLaunched 
            ? domainConfig.message 
            : 'Your branded telehealth platform is configured and ready to go live. Review your setup and launch when you\'re ready.'
          }
        </p>
        {isLaunched && (
          <div className="mt-4">
            <Badge 
              variant={domainConfig.status === 'live' ? 'default' : 'secondary'}
              className={`${domainConfig.statusColor} text-sm px-3 py-1`}
            >
              {domainConfig.status === 'live' && <Check className="mr-1 h-3 w-3" />}
              {domainConfig.status === 'propagating' && <Clock className="mr-1 h-3 w-3" />}
              {domainConfig.status === 'awaiting' && <AlertCircle className="mr-1 h-3 w-3" />}
              {domainConfig.statusText}
            </Badge>
            <p className="text-sm text-slate-500 mt-2">
              You'll also receive an email once your platform is live.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Summary */}
        <div className="space-y-6">
          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <Star className="mr-2 text-yellow-500" />
              Platform Summary
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Business Name</Label>
                  <div className="text-slate-800 font-medium">{businessInfo.businessName}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Business Type</Label>
                  <div className="text-slate-800 font-medium">{businessInfo.businessType}</div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-slate-600">Platform Focus</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {businessInfo.platformPurpose.map((purpose) => (
                    <Badge key={purpose} variant="secondary">{purpose}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-slate-600">Selected Template</Label>
                <div className="text-slate-800 font-medium">{template.templateData?.name}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Brand Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: branding.brandColor }}
                    />
                    <span className="text-sm text-slate-700">{branding.brandColor}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Font Family</Label>
                  <div className="text-slate-800 font-medium">{branding.font}</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <Check className="mr-2 text-green-600" />
              Setup Complete
            </h3>
            
            <div className="space-y-3">
              {[
                'Platform configured and branded',
                'Domain setup completed',
                'Legal documents in place',
                'Payment processing ready',
                'SSL certificate installed',
                'HIPAA compliance enabled'
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Access Links */}
        <div className="space-y-6">
          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <Globe className="mr-2 text-blue-600" />
              Platform Access
            </h3>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                domainConfig.customerPortalActive 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label className={`text-sm font-medium ${
                        domainConfig.customerPortalActive ? 'text-blue-900' : 'text-gray-600'
                      }`}>
                        Customer Portal URL
                      </Label>
                      {isLaunched && (
                        <Badge 
                          variant={domainConfig.customerPortalActive ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {domainConfig.customerPortalActive ? (
                            <>
                              <Check className="mr-1 h-3 w-3" />
                              Live
                            </>
                          ) : domainConfig.status === 'propagating' ? (
                            <>
                              <Clock className="mr-1 h-3 w-3" />
                              Pending Activation
                            </>
                          ) : (
                            <>
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Awaiting DNS Update
                            </>
                          )}
                        </Badge>
                      )}
                    </div>
                    <div className={`text-sm font-mono ${
                      domainConfig.customerPortalActive ? 'text-blue-700' : 'text-gray-500'
                    }`}>
                      {platformUrl}
                    </div>
                    <p className={`text-xs mt-1 ${
                      domainConfig.customerPortalActive ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      Where patients will access your platform
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={!domainConfig.customerPortalActive}
                    className={`${
                      domainConfig.customerPortalActive
                        ? 'border-blue-300 text-blue-700 hover:bg-blue-50'
                        : 'border-gray-300 text-gray-400'
                    }`}
                  >
                    <ExternalLink size={16} className="mr-1" />
                    Visit
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-green-900">Merchant Portal URL</Label>
                      {isLaunched && (
                        <Badge variant="default" className="text-xs">
                          <Check className="mr-1 h-3 w-3" />
                          Live
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-green-700 font-mono">{adminUrl}</div>
                    <p className="text-xs text-green-600 mt-1">Manage your platform and patients</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Settings size={16} className="mr-1" />
                    Access
                  </Button>
                </div>
              </div>

              {/* DNS Records for Custom Domain */}
              {domainConfig.showDnsRecords && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="text-sm font-semibold text-orange-900 mb-3">Required DNS Records</h4>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded border border-orange-100">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-mono text-orange-800">
                          <div>Type: A</div>
                          <div>Name: @</div>
                          <div>Value: 185.158.133.1</div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => copyToClipboard('185.158.133.1')}
                          className="text-orange-600"
                        >
                          <Copy size={12} />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border border-orange-100">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-mono text-orange-800">
                          <div>Type: A</div>
                          <div>Name: www</div>
                          <div>Value: 185.158.133.1</div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => copyToClipboard('185.158.133.1')}
                          className="text-orange-600"
                        >
                          <Copy size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-orange-600 mt-2">
                    Add these records to your domain provider's DNS settings.
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <Users className="mr-2 text-purple-600" />
              Next Steps
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600">1</div>
                <div>
                  <div className="text-sm font-medium text-slate-800">Complete your admin profile</div>
                  <div className="text-xs text-slate-600">Add your professional credentials and bio</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600">2</div>
                <div>
                  <div className="text-sm font-medium text-slate-800">Set up your services</div>
                  <div className="text-xs text-slate-600">Configure consultation types and pricing</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600">3</div>
                <div>
                  <div className="text-sm font-medium text-slate-800">Test your platform</div>
                  <div className="text-xs text-slate-600">Make a test booking to ensure everything works</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600">4</div>
                <div>
                  <div className="text-sm font-medium text-slate-800">Start accepting patients</div>
                  <div className="text-xs text-slate-600">Share your platform URL and begin consultations</div>
                </div>
              </div>
            </div>
          </Card>

          {!isLaunched ? (
            <Card className="p-6 shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <div className="text-center">
                <Button
                  onClick={handleLaunch}
                  size="lg"
                  disabled={isLaunching}
                  className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg shadow-xl disabled:opacity-50"
                >
                  {isLaunching ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Launching Platform...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-3 h-6 w-6" />
                      Launch My Platform
                    </>
                  )}
                </Button>
                <p className="text-xs text-slate-600 mt-3">
                  {isLaunching 
                    ? 'Setting up your platform...' 
                    : 'Your platform will be live within 2-3 minutes'
                  }
                </p>
              </div>
            </Card>
          ) : (
            <Card className="p-6 shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <div className="text-center">
                <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  {domainConfig.status === 'live' && <Check className="h-8 w-8 text-green-600" />}
                  {domainConfig.status === 'propagating' && <Clock className="h-8 w-8 text-yellow-600" />}
                  {domainConfig.status === 'awaiting' && <AlertCircle className="h-8 w-8 text-orange-600" />}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {domainConfig.status === 'live' 
                    ? 'Platform Launched Successfully!' 
                    : 'Platform Launch in Progress'
                  }
                </h3>
                <p className="text-sm text-slate-600">
                  You will be notified once the domain is fully verified and live.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="flex justify-start">
        <Button
          onClick={onPrev}
          variant="outline"
          className="h-12 px-6"
        >
          <ChevronLeft size={16} className="mr-2" />
          Previous
        </Button>
      </div>
    </div>
  );
};
