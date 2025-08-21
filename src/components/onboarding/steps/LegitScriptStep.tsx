import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Shield, Copy, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LegitScript } from '../types';

interface LegitScriptStepProps {
  data: LegitScript;
  onUpdate: (data: LegitScript) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const LegitScriptStep: React.FC<LegitScriptStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const { toast } = useToast();

  // Mock data - in real implementation, these would come from admin settings
  const couponCode = "HYRTECHLS25";
  const applicationUrl = "https://legitscript.com/application";
  
  const requiredResources = [
    {
      title: "Terms & Conditions",
      description: "Your platform's terms and conditions document that users agree to.",
      url: "https://yourplatform.com/terms-conditions"
    },
    {
      title: "HIPAA Compliance Document",
      description: "Documentation proving your platform meets HIPAA compliance requirements.",
      url: "https://yourplatform.com/hipaa-compliance"
    },
    {
      title: "Privacy Policy",
      description: "Your platform's privacy policy explaining how user data is handled.",
      url: "https://yourplatform.com/privacy-policy"
    }
  ];

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${label} has been copied to your clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the text manually.",
        variant: "destructive",
      });
    }
  };

  const openApplicationUrl = () => {
    window.open(applicationUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">LegitScript Certification</h1>
        <p className="text-slate-600 text-lg">Complete your certification to ensure compliance and accelerate approval</p>
      </div>

      {/* Intro Section */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 text-center">
            To begin the LegitScript certification process, please use the coupon code below and follow the application link. 
            Completing this step ensures compliance and helps accelerate your approval.
          </p>
        </CardContent>
      </Card>

      {/* Coupon Code Display */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">Exclusive Coupon Code</h3>
            <div className="flex items-center justify-center space-x-3">
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-green-100 text-green-800 border-green-200">
                {couponCode}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(couponCode, "Coupon code")}
                className="flex items-center space-x-1"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </Button>
            </div>
            <p className="text-sm text-slate-500">
              Apply this coupon code during your LegitScript application to receive your discount.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Application URL */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">Start Your Application</h3>
            <Button
              onClick={openApplicationUrl}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Go to Application</span>
            </Button>
            <p className="text-sm text-slate-600">
              Click the link above to start your LegitScript application. Make sure to apply your coupon code during checkout.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Required Resources */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Required Resources</h3>
          <p className="text-slate-600 mb-4">
            You'll need to provide these documents during your LegitScript application:
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            {requiredResources.map((resource, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>{resource.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <p className="text-slate-600">{resource.description}</p>
                    <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-md">
                      <code className="flex-1 text-sm text-slate-700 bg-white px-2 py-1 rounded border">
                        {resource.url}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(resource.url, resource.title + " URL")}
                        className="flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Link</span>
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Instructions/Next Steps */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
              <p className="text-blue-800 text-sm">
                Once you have completed your LegitScript application, our team will verify your certification and update your account status. 
                You can continue with the onboarding flow while this verification is pending.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={onPrev} className="flex items-center space-x-2">
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        
        <Button 
          onClick={onNext}
          className="flex items-center space-x-2"
        >
          <span>Save & Continue</span>
        </Button>
      </div>
    </div>
  );
};