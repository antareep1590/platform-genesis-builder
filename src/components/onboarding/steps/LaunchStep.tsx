
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Rocket, ExternalLink, Settings, Users, Globe, Check, Star } from 'lucide-react';
import { OnboardingData } from '../types';

interface LaunchStepProps {
  onboardingData: OnboardingData;
  onPrev: () => void;
}

export const LaunchStep: React.FC<LaunchStepProps> = ({
  onboardingData,
  onPrev
}) => {
  const { businessInfo, branding, domain, template } = onboardingData;
  
  const platformUrl = domain.domainOption === 'custom' 
    ? domain.customDomain 
    : domain.domainOption === 'subdomain'
    ? `${domain.subdomain || 'your-business'}.myplatform.com`
    : 'your-new-domain.com';

  const adminUrl = `admin.${platformUrl}`;

  const handleLaunch = () => {
    // Simulate platform launch
    console.log('Launching platform with data:', onboardingData);
    // In a real app, this would trigger the platform creation process
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Rocket className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Ready to Launch!</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Your branded telehealth platform is configured and ready to go live. Review your setup and launch when you're ready.
        </p>
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
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-blue-900">Patient Portal</Label>
                    <div className="text-sm text-blue-700 font-mono">{platformUrl}</div>
                    <p className="text-xs text-blue-600 mt-1">Where patients will access your platform</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                    <ExternalLink size={16} className="mr-1" />
                    Visit
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-green-900">Admin Dashboard</Label>
                    <div className="text-sm text-green-700 font-mono">{adminUrl}</div>
                    <p className="text-xs text-green-600 mt-1">Manage your platform and patients</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-green-300 text-green-700">
                    <Settings size={16} className="mr-1" />
                    Access
                  </Button>
                </div>
              </div>
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

          <Card className="p-6 shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="text-center">
              <Button
                onClick={handleLaunch}
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg shadow-xl"
              >
                <Rocket className="mr-3 h-6 w-6" />
                Launch My Platform
              </Button>
              <p className="text-xs text-slate-600 mt-3">
                Your platform will be live within 2-3 minutes
              </p>
            </div>
          </Card>
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

// Helper Label component for consistency
const Label = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-sm font-medium text-slate-600 ${className}`}>
    {children}
  </div>
);
