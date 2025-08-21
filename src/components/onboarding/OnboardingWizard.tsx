
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { BusinessInfoStep } from './steps/BusinessInfoStep';
import { TemplateSelectionStep } from './steps/TemplateSelectionStep';
import { BrandingStep } from './steps/BrandingStep';
import { PreviewStep } from './steps/PreviewStep';
import { PricingStep } from './steps/PricingStep';
import { DomainStep } from './steps/DomainStep';
import { LegalStep } from './steps/LegalStep';
import { LaunchStep } from './steps/LaunchStep';
import { LegitScriptStep } from './steps/LegitScriptStep';

import { BankVerificationStep } from './steps/BankVerificationStep';
import { ApplicationStatusStep } from './steps/ApplicationStatusStep';
import { OnboardingData } from './types';

const steps = [
  { id: 1, title: 'Business Info', description: 'Tell us about your business' },
  { id: 2, title: 'Choose Template', description: 'Select your design theme' },
  { id: 3, title: 'Customize Branding', description: 'Add your brand identity' },
  { id: 4, title: 'Visual Preview', description: 'See your platform preview' },
  { id: 5, title: 'Pricing & Payment', description: 'Complete your purchase' },
  { id: 6, title: 'Domain Setup', description: 'Configure your domain' },
  { id: 7, title: 'Legal Documents', description: 'Upload legal requirements' },
  { id: 8, title: 'Bank Verification', description: 'RevitPay pre-application form' },
  { id: 9, title: 'Application Status', description: 'Application review status' },
  { id: 10, title: 'LegitScript Certification', description: 'Optional health product certification' },
  { id: 11, title: 'Launch', description: 'Review and go live' }
];

export const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessInfo: {
      businessName: '',
      businessType: '',
      platformPurpose: [],
      supportEmail: '',
      supportPhone: '',
      phoneSupportHours: '',
    },
    template: {
      selectedTemplate: '',
      templateData: null,
    },
    branding: {
      logo: null,
      brandColor: '#3B82F6',
      accentColor: '#10B981',
      font: 'Inter',
      displayName: '',
      tagline: '',
      socialLinks: {
        instagram: '',
        facebook: '',
        linkedin: '',
        twitter: '',
        youtube: '',
      },
    },
    domain: {
      subdomain: '',
      customDomain: '',
      domainOption: 'subdomain',
    },
    legal: {
      termsConditions: null,
      privacyPolicy: null,
      hipaaCompliance: null,
      useTemplates: true,
      additionalDocuments: [],
    },
    bankVerification: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      ssn: '',
      ownershipPercentage: 0,
      contactPhone: '',
      contactEmail: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      idDetails: {
        idType: '',
        idNumber: '',
        expirationDate: '',
      },
      hasOtherOwners: false,
      otherOwners: [],
      ownershipType: '',
      legalBusinessName: '',
      dbaName: '',
      taxId: '',
      businessType: '',
      premiseType: '',
      yearsInBusiness: 0,
      businessWebsite: '',
      businessAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      businessAddressSameAsPersonal: true,
      businessPhone: '',
      businessEmail: '',
      bankName: '',
      routingNumber: '',
      accountNumber: '',
      currentlyProcessing: false,
      processingMethods: [],
      maxMonthlySales: 0,
      avgTransaction: 0,
      highestTransaction: 0,
      fraudProtection: false,
      acceptACH: false,
      businessFundingInterest: false,
      driverLicense: null,
      bankStatements: [],
      incorporationDocs: null,
      wantsLegitScript: false,
    },
    legitScript: {
      applyNow: true,
      businessName: '',
      npiNumber: '',
      documentsSignature: {
        document1: false,
        document2: false,
        document3: false,
      },
    },
    applicationStatus: {
      status: 'submitted',
      submittedAt: '',
      reviewedAt: '',
      message: '',
    },
    payment: {
      completed: false,
      transactionId: '',
      acceptedTerms: false,
    },
  });

  const updateOnboardingData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep === 9 && onboardingData.applicationStatus.status === 'approved' && !onboardingData.bankVerification.wantsLegitScript) {
      // Skip LegitScript step if application approved and user doesn't want it
      setCurrentStep(11);
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep === 11 && !onboardingData.bankVerification.wantsLegitScript) {
      // Skip back to Application Status step if LegitScript was skipped
      setCurrentStep(9);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitApplication = () => {
    // Submit the application and update status
    const submissionData = {
      status: 'submitted' as const,
      submittedAt: new Date().toISOString(),
      message: ''
    };
    updateOnboardingData({ applicationStatus: submissionData });
    setCurrentStep(9);
  };

  const resubmitApplication = () => {
    // Go back to bank verification step for resubmission
    setCurrentStep(8);
  };

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessInfoStep
            data={onboardingData.businessInfo}
            onUpdate={(data) => updateOnboardingData({ businessInfo: data })}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <TemplateSelectionStep
            data={onboardingData.template}
            businessType={onboardingData.businessInfo.businessType}
            onUpdate={(data) => updateOnboardingData({ template: data })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <BrandingStep
            data={onboardingData.branding}
            onUpdate={(data) => updateOnboardingData({ branding: data })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <PreviewStep
            onboardingData={onboardingData}
            onNext={nextStep}
            onPrev={prevStep}
            onGoToStep={goToStep}
          />
        );
      case 5:
        return (
          <PricingStep
            data={onboardingData.payment}
            onUpdate={(data) => updateOnboardingData({ payment: data })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 6:
        return (
          <DomainStep
            data={onboardingData.domain}
            businessName={onboardingData.businessInfo.businessName}
            onUpdate={(data) => updateOnboardingData({ domain: data })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 7:
        return (
          <LegalStep
            data={onboardingData.legal}
            onUpdate={(data) => updateOnboardingData({ legal: data })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 8:
        return (
          <BankVerificationStep
            data={onboardingData.bankVerification}
            onUpdate={(data) => updateOnboardingData({ bankVerification: data })}
            onSubmit={submitApplication}
            onPrev={prevStep}
            prefillData={{
              firstName: onboardingData.businessInfo.businessName.split(' ')[0] || '',
              lastName: onboardingData.businessInfo.businessName.split(' ').slice(1).join(' ') || '',
              businessName: onboardingData.businessInfo.businessName,
              businessPhone: onboardingData.businessInfo.supportPhone,
              businessEmail: onboardingData.businessInfo.supportEmail,
            }}
          />
        );
      case 9:
        return (
          <ApplicationStatusStep
            data={onboardingData.applicationStatus}
            onUpdate={(data) => updateOnboardingData({ applicationStatus: data })}
            onNext={nextStep}
            onResubmit={resubmitApplication}
          />
        );
      case 10:
        return (
          <LegitScriptStep
            data={onboardingData.legitScript}
            onUpdate={(data) => updateOnboardingData({ legitScript: data })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 11:
        return (
          <LaunchStep
            onboardingData={onboardingData}
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Progress Sidebar */}
      <div className="w-80 bg-white shadow-xl border-r border-slate-200 p-6 hidden lg:block">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Platform Setup</h1>
          <p className="text-slate-600">Create your branded telehealth platform</p>
        </div>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                currentStep === step.id
                  ? 'bg-blue-50 border border-blue-200'
                  : currentStep > step.id
                  ? 'bg-green-50 border border-green-200'
                  : 'hover:bg-slate-50'
              }`}
              onClick={() => goToStep(step.id)}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step.id
                    ? 'bg-blue-600 text-white'
                    : currentStep > step.id
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {currentStep > step.id ? <Check size={16} /> : step.id}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    currentStep === step.id
                      ? 'text-blue-900'
                      : currentStep > step.id
                      ? 'text-green-900'
                      : 'text-slate-700'
                  }`}
                >
                  {step.title}
                </p>
                <p
                  className={`text-xs ${
                    currentStep === step.id
                      ? 'text-blue-700'
                      : currentStep > step.id
                      ? 'text-green-700'
                      : 'text-slate-500'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-slate-50 rounded-lg">
          <div className="text-sm text-slate-600 mb-2">Progress</div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Step {currentStep} of {steps.length}
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-slate-200 p-4 z-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-semibold text-slate-800">Platform Setup</h1>
          <span className="text-sm text-slate-600">
            {currentStep}/{steps.length}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:pt-0 pt-20">
        <div className="h-full overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
};
