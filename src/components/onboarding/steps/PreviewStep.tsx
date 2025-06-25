
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Monitor, Smartphone, Tablet } from 'lucide-react';
import { OnboardingData } from '../types';

interface PreviewStepProps {
  onboardingData: OnboardingData;
  onNext: () => void;
  onPrev: () => void;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  onboardingData,
  onNext,
  onPrev
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getDeviceClass = () => {
    switch (deviceView) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'w-full';
    }
  };

  const renderPreviewContent = (pageType: string) => {
    const { branding, businessInfo } = onboardingData;
    
    return (
      <div 
        className={`bg-white rounded-lg shadow-lg overflow-hidden ${getDeviceClass()}`}
        style={{ fontFamily: branding.font }}
      >
        {/* Header */}
        <div 
          className="p-6 text-white"
          style={{ backgroundColor: branding.brandColor }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {branding.displayName || businessInfo.businessName}
              </h1>
              <p className="opacity-90">
                {branding.tagline}
              </p>
            </div>
            {branding.logo && (
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                Logo
              </div>
            )}
          </div>
        </div>

        {/* Content based on page type */}
        <div className="p-6">
          {pageType === 'landing' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  Transform Your Health Journey
                </h2>
                <p className="text-lg text-slate-600 mb-6">
                  Professional {businessInfo.businessType.toLowerCase()} services focused on {businessInfo.platformPurpose.join(', ').toLowerCase()}
                </p>
                <Button 
                  className="h-12 px-8 text-white font-medium"
                  style={{ backgroundColor: branding.accentColor }}
                >
                  Get Started Today
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {businessInfo.platformPurpose.slice(0, 3).map((purpose, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <div 
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: `${branding.accentColor}20` }}
                    >
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: branding.accentColor }}
                      />
                    </div>
                    <h3 className="font-semibold text-slate-800">{purpose}</h3>
                    <p className="text-sm text-slate-600 mt-2">
                      Professional {purpose.toLowerCase()} services tailored to your needs
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pageType === 'intake' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Health Assessment Form</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">First Name</label>
                    <div className="h-10 bg-slate-100 rounded border"></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Last Name</label>
                    <div className="h-10 bg-slate-100 rounded border"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <div className="h-10 bg-slate-100 rounded border"></div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Health Goals</label>
                  <div className="h-24 bg-slate-100 rounded border"></div>
                </div>
                <Button 
                  className="w-full h-12 text-white font-medium"
                  style={{ backgroundColor: branding.brandColor }}
                >
                  Submit Assessment
                </Button>
              </div>
            </div>
          )}

          {pageType === 'product' && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="aspect-square bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-slate-500">Product Image</div>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-4">
                    Premium {businessInfo.platformPurpose[0]} Program
                  </h2>
                  <div className="text-3xl font-bold mb-4" style={{ color: branding.accentColor }}>
                    $199/month
                  </div>
                  <p className="text-slate-600 mb-6">
                    Comprehensive {businessInfo.platformPurpose[0].toLowerCase()} program designed to help you achieve your health goals with professional guidance.
                  </p>
                  <Button 
                    className="w-full h-12 text-white font-medium mb-4"
                    style={{ backgroundColor: branding.brandColor }}
                  >
                    Add to Cart
                  </Button>
                  <div className="text-sm text-slate-600">
                    ✓ Professional consultation included<br/>
                    ✓ Personalized treatment plan<br/>
                    ✓ Ongoing support and monitoring
                  </div>
                </div>
              </div>
            </div>
          )}

          {pageType === 'booking' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Schedule Your Consultation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Select Date</h3>
                  <div className="bg-slate-100 rounded-lg p-4 h-48 flex items-center justify-center">
                    <div className="text-slate-500">Calendar Component</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Available Times</h3>
                  <div className="space-y-2">
                    {['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM'].map((time) => (
                      <button
                        key={time}
                        className="w-full p-3 text-left border rounded-lg hover:border-blue-500 transition-colors"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Button 
                className="w-full h-12 text-white font-medium mt-6"
                style={{ backgroundColor: branding.brandColor }}
              >
                Book Appointment
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Preview Your Platform</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          See how your branded platform will look to your patients across different pages.
        </p>
      </div>

      <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <Tabs defaultValue="landing" className="flex-1">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="landing">Landing Page</TabsTrigger>
              <TabsTrigger value="intake">Intake Form</TabsTrigger>
              <TabsTrigger value="product">Product Page</TabsTrigger>
              <TabsTrigger value="booking">Booking Page</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2 mt-4 mb-6">
              <Button
                variant={deviceView === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceView('desktop')}
              >
                <Monitor size={16} className="mr-2" />
                Desktop
              </Button>
              <Button
                variant={deviceView === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceView('tablet')}
              >
                <Tablet size={16} className="mr-2" />
                Tablet
              </Button>
              <Button
                variant={deviceView === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceView('mobile')}
              >
                <Smartphone size={16} className="mr-2" />
                Mobile
              </Button>
            </div>

            <TabsContent value="landing" className="mt-6">
              <div className="border-2 border-slate-200 rounded-lg p-4 bg-slate-50 min-h-[600px]">
                {renderPreviewContent('landing')}
              </div>
            </TabsContent>
            
            <TabsContent value="intake" className="mt-6">
              <div className="border-2 border-slate-200 rounded-lg p-4 bg-slate-50 min-h-[600px]">
                {renderPreviewContent('intake')}
              </div>
            </TabsContent>
            
            <TabsContent value="product" className="mt-6">
              <div className="border-2 border-slate-200 rounded-lg p-4 bg-slate-50 min-h-[600px]">
                {renderPreviewContent('product')}
              </div>
            </TabsContent>
            
            <TabsContent value="booking" className="mt-6">
              <div className="border-2 border-slate-200 rounded-lg p-4 bg-slate-50 min-h-[600px]">
                {renderPreviewContent('booking')}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button
          onClick={onPrev}
          variant="outline"
          className="h-12 px-6"
        >
          <ChevronLeft size={16} className="mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={onNext}
          className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Looks Great! Continue
        </Button>
      </div>
    </div>
  );
};
